<template>
    <div>
        <table class="tb">
            <tr>
                <th>市值排名</th>
                <th>名称</th>
                <th>最新价</th>
                <th>最高</th>
                <th>最低</th>
                <th>24H涨跌</th>
                <th>成交量</th>
                <th>成交额</th>
                <th>流通市值</th>
            </tr>
            <tr v-for="item in list" :key="item.kindCode">
                <td>{{item.capitalizationSort}}</td>
                <td>{{item.kind}}</td>
                <td class="new">¥{{item.priceCNY | numFmt3}}</td>
                <td class="max">¥{{item.maxPriceCNY | numFmt3}}</td>
                <td class="max">¥{{item.minPriceCNY | numFmt3}}</td>
                <td class="rose up" v-if="item.rose > 0">+{{item.rose | numFmt2}}%</td>
                <td class="rose down" v-else-if="item.rose < 0">{{item.rose | numFmt2}}%</td>
                <td class="rose" v-else>{{item.rose | numFmt2}}%</td>
                <td>{{item.volume | numFmt}}</td>
                <td>{{item.turnoverCNY | numFmt}}</td>
                <td>¥{{item.capitalization | numFmt}}</td>
            </tr>
        </table>
    </div>
</template>

<script>
import { baseUrl } from './../api/baseUrl'
export default {
    data() {
        return {
            list: [],
            curIndex: 0,
            templist: [],
            codelist: []
        }
    },
    methods: {
        getList() {
            this.$axios.post(`${baseUrl}/market-rest/market-info-list-v2`, { marketType: 1, pageIndex: 1, pageSize: 30 })
            .then(res => {
                if(res.data.code == 0 && res.data.success){
                    if(res.data.data){
                        this.templist = [];
                        this.codelist = [];
                        for(let i = this.curIndex; i < this.curIndex + 3; i++){
                            this.codelist.push(res.data.data[i].kindCode);
                            this.templist.push(res.data.data[i]);
                        }
                        this.curIndex += 3;
                        if(this.curIndex > res.data.data.length - 1){
                            this.curIndex = 0;
                        }
                        this.getPrice();
                    }
                }else{

                }
            }).catch(() => {

            })
        },
        getPrice() {
            this.$axios.get(`${baseUrl}/market-rest/realtime-one-point`, { params: { marketType: 1, kindList: this.codelist.join(',') } })
            .then(res => {
                if(res.data.code == 0 && res.data.success){
                    console.log(res.data.data);
                    if(res.data.data){
                        for(let v of res.data.data){
                            for(let t of this.templist){
                                if(t.kindCode == v.kindCode){
                                    t.maxPriceCNY = v.maxPriceCNY;
                                    t.minPriceCNY = v.minPriceCNY;
                                    break;
                                }
                            }
                        }
                        this.list = this.templist;
                    }
                }
            })
        }
    },
    filters: {
        numFmt: function(num) {
            if(!num || num == '' || isNaN(Number(num))){
                return 0;
            }else if(num < 1){
                return parseFloat(parseFloat(num).toFixed(8));
            }else if(num < 10000){
                return parseFloat(parseFloat(num).toFixed(2));
            }else if(num < 100000000){
                num = num / 10000;
                return parseFloat(parseFloat(num).toFixed(2)) + '万';
            }else{
                num = num / 100000000;
                return parseFloat(parseFloat(num).toFixed(2)) + '亿';
            }
        },
        numFmt2: function(num) {
            return parseFloat(parseFloat(num).toFixed(2));
        },
        numFmt3: function(num) {
            if(num < 1){
                return parseFloat(parseFloat(num).toFixed(8));
            }
            return parseFloat(parseFloat(num).toFixed(2));
        }
    },
    mounted() {
        this.getList();
        setInterval(() => {
            this.getList();
        }, 60000);
        
    }
}
</script>

<style>
html, body{
    width: 768px;
    font-size: 14px;
    padding: 0;
    margin: 0 auto;
}
.tb{
    width: 100%;
    border: none;
    text-align: center;
    background: #000;
    padding-bottom: 5px;
}
.tb th{
    color: #999;
    height: 30px;
    line-height: 30px;
}
.tb td{
    color: #fff;
    height: 20px;
    line-height: 20px;
    font-size: 12px;
}
.tb .new{
    color: #c52b18;
}
.tb .max{
    color: #00ac1e;
}
.tb .rose.up{
    color: #00ac1e;
}
.tb .rose.down{
    color: #c52b18;
}
</style>

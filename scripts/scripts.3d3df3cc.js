angular.module("sachinRtApp",["ngAnimate","ui.router","ng-fusioncharts","ui-rangeSlider"]).run(["$rootScope","$state","csvProcessor",function(a,b,c){a.$on("$stateChangeStart",function(d,e,f){a.stats||(a.loadingCSV=!0,d.preventDefault(),c.processCSV().then(function(c){a.stats=c,a.loadingCSV=!1,b.go(e.name,f)})["catch"](function(){alert("error! loading csv")}))})}]).config(["$stateProvider","$urlRouterProvider",function(a,b){b.otherwise("/"),a.state("home",{url:"/",templateUrl:"views/main.html",controller:"MainCtrl"})}]),angular.module("sachinRtApp").service("csvProcessor",["$http","$q",function(a,b){this.readCSV=function(){return a({url:window.location.href.slice(0,-2)+"sachin.csv",method:"GET"})},this.processCSV=function(){var a=b.defer();return this.readCSV().then(function(b){for(var c=b.data.split(/\r\n|\n/),d=c[0].split(","),e=["wickets","runs_conceded","catches","stumps"],f=[],g=1;g<c.length-1;g++){for(var h=c[g].split(","),i={},j=0;j<d.length;j++)"batting_score"===d[j]?("*"===h[j].slice(-1)&&(i.notOut=!0),i[d[j]]=parseInt(h[j])):e.indexOf(d[j])>-1?i[d[j]]=parseInt(h[j]):"opposition"===d[j]?i[d[j]]=h[j].slice(2,h[j].length):i[d[j]]=h[j];f.push(i)}a.resolve(f)})["catch"](function(b){a.reject(b)}),a.promise}}]),angular.module("sachinRtApp").controller("MainCtrl",["$scope","$rootScope","$timeout",function(a,b,c){var d=b.stats;b.loadingCSV=!0,a.runsScored={},a.totalRuns=null,a.totalMatches=d.length,a.totalWickets=null,a.totalCatches=null,a.totalHundreds=null,a.totalFifties=null,a.average=null,a.notOutCount=null,a.totalInnings=null,a.runsType="Yearly",a.year={min:1995,max:2005},c(function(){b.loadingCSV=!1},3e3),a.sachinQuotes=["There are two kind of batsmen in the world. One Sachin Tendulkar. Two all the others. - Andy Flower","I have seen God, he bats at no. 4 for India. - Mathew Hayden","He can play that leg glance with a walking stick also. - Waqar Younis","Gentelmen,he is the best batsman I have seen in my life.And unlike most of you, I have seen Bradman bat. - John Woodcock"];var e=[],f=[],g=[],h=[],i=[],j=[],k=[],l=[],m=[],n=[],o=[],p=[],q=[],r=[],s=[],t=function(b){var c=f.indexOf(b.date.slice(-4));0>c&&(f.push(b.date.slice(-4)),j.push({label:b.date.slice(-4),value:null,displayValue:"0"}),1===f.length?k.push({label:b.date.slice(-4),value:0,displayValue:"0"}):k.push({label:b.date.slice(-4),value:k[f.length-2].value,displayValue:parseInt(k[f.length-2].displayValue).toString()}),c=f.length-1),isNaN(b.batting_score)||(b.notOut&&a.notOutCount++,a.totalInnings++,j[c].value+=b.batting_score,k[c].value+=b.batting_score,j[c].displayValue=(parseInt(j[c].displayValue)+1).toString()+" Innings",k[c].displayValue=(parseInt(k[c].displayValue)+1).toString()+" Innings")},u=function(b){var c=e.indexOf(b.opposition);0>c&&(e.push(b.opposition),h.push({label:b.opposition}),l.push({value:null}),q.push({value:null}),r.push({value:null}),s.push({value:null}),c=h.length-1),isNaN(b.batting_score)||(b.batting_score<50?s[c].value+=b.batting_score:b.batting_score>=50&&b.batting_score<100?(a.totalFifties++,r[c].value+=b.batting_score):b.batting_score>=100&&b.batting_score<200?(a.totalHundreds++,q[c].value+=b.batting_score):(a.totalHundreds++,l[c].value+=b.batting_score))},v=function(a){isNaN(a.wickets)||p.push({label:a.date.slice(-4),value:a.wickets,toolText:a.wickets+"/"+a.runs_conceded+"{br}v "+a.opposition+"{br}"+a.ground+"{br}"+a.date})},w=function(b){var c=b.date.slice(-4);if(c>=a.year.min&&c<=a.year.max){var d=g.indexOf(b.ground);if(0>d&&(g.push(b.ground),i.push({label:b.ground}),m.push({value:0}),n.push({value:0}),o.push({value:0}),d=g.length-1),!isNaN(b.batting_score)){var e=b.batting_score;m[d].value+=e,e>=100&&(o[d].value+=1),n[d].value<e&&(n[d].value=e)}}};d.forEach(function(b){isNaN(b.batting_score)||(a.totalRuns+=b.batting_score),isNaN(b.wickets)||(a.totalWickets+=b.wickets),isNaN(b.catches)||(a.totalCatches+=b.catches),t(b),u(b),v(b),w(b),c(function(){a.average=(a.totalRuns/(a.totalInnings-a.notOutCount)).toFixed(2),a.runsByVenue.categories=[{category:i}],a.runsByVenue.dataset=[{seriesname:"Runs",data:m},{seriesname:"Highest Score",data:n}]},0)}),a.changeScoreBasis=function(b){"overall"===b?(a.runsScored.chart.subcaption="Overall",a.runsScored.data=k):(a.runsScored.chart.subcaption="Yearly",a.runsScored.data=j)},a.rangeChange=function(){g=[],i=[],m=[],n=[],d.forEach(function(a){w(a)}),c(function(){a.runsByVenue.categories=[{category:i}],a.runsByVenue.dataset=[{seriesname:"Runs",data:m},{seriesname:"Highest Score",data:n}]},0)},a.countryWiseScore={chart:{caption:"Sachin's Score against different countries",xaxisname:"Countries",yaxisname:"Runs",paletteColors:"#3D348B,#7678ED,#F7B801,#F18701",plotToolText:"Country: $label <br> Total Runs: $unformattedSum",toolTipBgColor:"#000",toolTipColor:"#fff",toolTipBorderAlpha:"10",showToolTipShadow:"1",adjustDiv:0,yAxisMinValue:0,yAxisMaxValue:3200,formatNumberScale:0,bgColor:"#ffffff",borderAlpha:"20",showCanvasBorder:"0",usePlotGradientColor:"0",plotBorderAlpha:"10",legendBorderAlpha:"0",valueFontColor:"#ffffff",showXAxisLine:"1",xAxisLineColor:"#999999",divlineColor:"#999999",divLineDashed:"1",showAlternateHGridColor:"0",subcaptionFontBold:"0",subcaptionFontSize:"14"},categories:[{category:h}],dataset:[{dataset:[{seriesname:"Rest",data:s},{seriesname:"Fifties",data:r},{seriesname:"Hundreds",data:q},{seriesname:"Two-Hundreds",data:l}]}]},a.runsScored={chart:{caption:"SACHIN TENDULKAR'S ODI CAREER(Batting)",subcaption:"Yearly",xAxisName:"Years",yAxisName:"Runs",lineThickness:"2",formatNumber:!1,formatNumberScale:0,paletteColors:"#0075c2",baseFontColor:"#333333",baseFont:"Helvetica Neue,Arial",plotToolText:"Year: $label <br> Runs: $value <br> Played : $displayValue",toolTipBgColor:"#000",toolTipColor:"#fff",toolTipBorderAlpha:"10",showToolTipShadow:"1",captionFontSize:"14",subcaptionFontSize:"14",subcaptionFontBold:"0",showBorder:"0",bgColor:"#ffffff",showShadow:"0",canvasBgColor:"#ffffff",canvasBorderAlpha:"0",divlineAlpha:"100",divlineColor:"#999999",divlineThickness:"1",divLineDashed:"1",divLineDashLen:"1",showXAxisLine:"1",xAxisLineThickness:"1",xAxisLineColor:"#999999",showAlternateHGridColor:"0"},data:j},a.wickets={chart:{caption:"SACHIN TENDULKAR'S ODI CAREER(Bowling)",xAxisName:"Matches",yAxisName:"Wickets",paletteColors:"#0075c2",adjustDiv:0,yAxisMinValue:0,yAxisMaxValue:5,formatNumberScale:0,toolTipBgColor:"#000",toolTipColor:"#fff",toolTipBorderAlpha:"10",showToolTipShadow:"1",bgColor:"#ffffff",borderAlpha:"20",canvasBorderAlpha:"0",usePlotGradientColor:"0",plotBorderAlpha:"10",rotatevalues:"1",showValues:"0",showXAxisLine:"1",xAxisLineColor:"#999999",divlineColor:"#999999",divLineDashed:"1",showAlternateHGridColor:"0",subcaptionFontBold:"0",subcaptionFontSize:"14"},data:p},a.runsByVenue={chart:{caption:"Batting statistics by venue",xAxisName:"Venue",yAxisName:"Runs",adjustDiv:0,showLimits:0,formatNumberScale:0,showBorder:"0",bgColor:"#ffffff",paletteColors:"#42F2F7,#46ACC2",showShadow:"0",scrollPadding:10,showCanvasBorder:"0",plotFillAlpha:"100",showAlternateHGridColor:"0",lineThickness:"3",flatScrollBars:"1",scrollheight:"10",numVisiblePlot:"12",showHoverEffect:"1",toolTipBgColor:"#000",toolTipColor:"#fff",toolTipBorderAlpha:"10",showToolTipShadow:"1"}}}]),angular.module("sachinRtApp").run(["$templateCache",function(a){"use strict";a.put("views/main.html",'<div class="home-wrap"> <span>Sachin Tendulkar</span> <span>Total ODIs : {{totalMatches}}</span> <span>Total Runs : {{totalRuns}}</span> <span class="quote">{{sachinQuotes[0]}}</span> </div> <div class="runs-chart"> <div class="dropdown" ng-click="showGraphType = !showGraphType"> <label for="runs">Score\'s Basis :</label> <input type="text" name="score basis" id="runs" ng-model="runsScored.chart.subcaption" disabled autocomplete="off" required> <i class="fa fa-angle-down" ng-show="!showGraphType"></i> <i class="fa fa-angle-up" ng-show="showGraphType"></i> <div class="select-options ng-hide" ng-show="showGraphType"> <div ng-click="changeScoreBasis(\'overall\')"> Overall </div> <div ng-click="changeScoreBasis(\'yearly\')"> Yearly </div> </div> </div> <fusioncharts width="100%" height="400" type="line" dataformat="json" datasource="{{runsScored}}"></fusioncharts> </div> <div class="home-wrap"> <span>Total 100s : {{totalHundreds}}</span> <span>Total 50s : {{totalFifties}}</span> <span>Highest Score : 200</span> <span class="quote">{{sachinQuotes[1]}}</span> </div> <div class="batting-stat"> <fusioncharts width="100%" height="400" type="msstackedcolumn2d" dataformat="json" datasource="{{countryWiseScore}}"></fusioncharts> </div> <div class="home-wrap"> <span>Total Wickets : {{totalWickets}}</span> <span>Total Catches : {{totalCatches}}</span> <span class="quote">{{sachinQuotes[2]}}</span> </div> <div class="bowling-stat"> <fusioncharts width="100%" height="400" type="column2d" dataformat="json" datasource="{{wickets}}"></fusioncharts> </div> <div class="home-wrap"> <span>Average : {{average}}</span> <span>Not Out : {{notOutCount}}</span> <span class="quote">{{sachinQuotes[3]}}</span> </div> <div class=""> <div class="slider"> <div range-slider min="1989" max="2012" step="1" model-min="year.min" model-max="year.max" on-handle-up="rangeChange()"></div> <div class="slider-label"> <span>{{year.min}}</span> <span>{{year.max}}</span> </div> </div> <fusioncharts width="100%" height="400" type="scrollcolumn2d" dataformat="json" datasource="{{runsByVenue}}"></fusioncharts> </div> <div class="home-wrap"></div>')}]);
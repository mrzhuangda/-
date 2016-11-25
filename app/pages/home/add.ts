import {Component} from '@angular/core';
import {NavController,NavParams,ViewController,Loading,Storage,LocalStorage,Toast,Modal} from 'ionic-angular';
import {Http,Headers} from '@angular/http';

@Component({
  templateUrl: 'build/pages/home/add.html'
})

export class Add {
    citys;
    public city = {
        cityId: '',
        cityUpdate: '',
        cityName: '',
        cityWeather: '',
        cityTemp: '',
        cityRH: '',
        cityPres: '',
        cityAqiPm25: '',
        cityAqiQlty: '',
        cityAqi: '',
        wind: '',
        weatherImage:''

    }
    local: Storage;
    // city;
    constructor(private http: Http, private params: NavParams, private navCtrl: NavController, private viewCtrl: ViewController) {
        // this.city=params.data.city;
        this.navCtrl = navCtrl;
        this.viewCtrl = viewCtrl;
        this.local = new Storage(LocalStorage);
        // this.city={};
        // this.city.cityName='';
        this.local.get('citys').then((result) => {
            if (result) {
                this.citys = JSON.parse(result);
            } else {
                this.citys = [];
            }
            // console.log(this.citys);
        })
    }

    close() {
        // this.navCtrl.pop();
        this.viewCtrl.dismiss(this.citys);
    }

    search() {
        // console.log('您要添加的是：' + this.city.cityName);
         if(this.city.cityName == '' ){
            let toastF = Toast.create({
                    message: '请输入要查询的城市',
                    duration: 2000,
                    position: 'bottom'
                });
             this.navCtrl.present(toastF);
             return false;
        }
        var apikey = '84f6725a95519ce2b95197f7f75a4df2';
        var header = new Headers();
        header.append('apikey', apikey);
        this.http.get("http://apis.baidu.com/heweather/weather/free?city=" + this.city.cityName, { headers: header }).subscribe(data => {
            var results = data.json()['HeWeather data service 3.0'][0];
            if (results.status == 'ok') {
                this.city.cityId = results.basic.id;
                this.city.cityName = results.basic.city;
                this.city.cityUpdate = results.basic.update.loc;
                this.city.cityTemp = results.now.tmp;
                this.city.cityRH = results.now.hum;
                this.city.cityWeather = results.now.cond.txt;
                this.city.cityPres = results.now.pres;
                this.city.cityAqiPm25 = results.aqi.city.pm25;
                this.city.cityAqiQlty = results.aqi.city.qlty;
                this.city.cityAqi = results.aqi.city.aqi;
                this.city.wind = results.now.wind.dir;
                 // if(this.city.cityWeather == "多云"){
                 //     this.city.weatherImage = 'duoyun'
                 // }
                 switch (this.city.cityWeather) {
                    case '晴转多云' :
                    case '多云' :  this.city.weatherImage = 'duoyun';break;
                    case '小雨' : 
                    case '阵雨' :
                    case '阴转阵雨' :
                     this.city.weatherImage = 'xiaoyu';break;
                    case '多云转晴':
                    case '晴' :  this.city.weatherImage = 'qing';break;
                    case '阴' :  this.city.weatherImage = 'yin';break;
                     
                 } 
                if (this.citys.length == 0) {
                    this.citys.push(this.city);//添加的前面展示
                } else {
                    let arr = [];
                    for (var index = 0; index < this.citys.length; index++) {
                        arr.push(this.citys[index].cityId);
                    }
                    let arrs = arr.join();
                    if (arr.indexOf(this.city.cityId) == -1) {
                        this.citys.push(this.city);
                    } else {
                        let toastF= Toast.create({
                    message: '已存在该城市!',
                    duration: 2000,
                    position: 'bottom'
                });
                this.navCtrl.present(toastF);
                  return false;
                    }
                }
            
                // console.log(this.citys);
                this.local.set('citys', JSON.stringify(this.citys));
                // let toastSuccess = Toast.create({
                //     message: '添加成功!',
                //     duration: 5000,
                //     position: 'middle'
                // });
                // this.navCtrl.present(toastSuccess);
                
            } else {
                // console.log('error');
                let toastFailed = Toast.create({
                    message: '获取数据失败!',
                    duration: 2000,
                    position: 'bottom'
                });
                this.navCtrl.present(toastFailed);
                return false;
            }
            this.viewCtrl.dismiss(this.citys);
        },error =>{
             let toastFailed = Toast.create({
                    message: '获取数据失败!',
                    duration: 2000,
                    position: 'bottom'
                });
                this.navCtrl.present(toastFailed);
        });
    }
}

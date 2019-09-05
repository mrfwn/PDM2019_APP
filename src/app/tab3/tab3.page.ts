import { Component, ViewChild } from '@angular/core';
import { NavController, IonicPage } from 'ionic-angular';
import { Chart as chartJs} from 'chart.js';
import { ContactService } from '../services/contact.service';
import { Observable } from 'rxjs/Observable';
@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page {
  @ViewChild('barCanvas') barCanvas;
    @ViewChild('lineCanvas') lineCanvas;
    @ViewChild('pieCanvas') pieCanvas;
    @ViewChild('doughnutCanvas') doughnutCanvas;
    contacts: Observable<any>;
    barChart: any;
    lineChart: any;
    pieChart: any;
    doughnutChart: any;
  constructor(private provider: ContactService) {
    this.contacts = this.provider.getAll();
  }

  // tslint:disable-next-line:use-life-cycle-interface
  ngAfterViewInit() {
    setTimeout(() => {
      this.barChart = this.getBarChart();
      this.lineChart = this.getLineChart();
    }, 150);
    setTimeout(() => {
      this.pieChart = this.getPieChart();
      this.doughnutChart = this.getDoughnutChart();
    }, 250);
  }

  getChart(context, chartType, data, options?) {
    return new chartJs(context, {
      data,
      options,
      type: chartType
    });
  }


  getBarChart() {
    const data = {
      labels: ['Conteúdo', 'Prêmio'],
      datasets: [
        {
          label: 'Presentes',
          data: [32, 50],
          backgroundColor: 'lightgreen',
          borderColor: 'green',
          borderWidth: 1
        },
        {
          label: 'Faltantes',
          data: [42, 23],
          backgroundColor: 'pink',
          borderColor: 'red',
          borderWidth: 1
        }
      ]
    };

    const options = {
      scales: {
        yAxes: [{
          ticks: {
            beginAtZero: true
          }
        }]
      }
    };

    return this.getChart(this.barCanvas.nativeElement, 'bar', data, options);
  }

  getLineChart() {
    const data = {
      labels: ['Janeiro', 'Fevereiro', 'Março', 'Abril'],
      datasets: [{
        label: 'Meu Dataset',
        fill: false,
        lineTension: 0.1,
        backgroundColor: 'rgb(0, 178, 255)',
        borderColor: 'rgb(231, 205, 35)',
        borderCapStyle: 'butt',
        borderJoinStyle: 'miter',
        pointRadius: 1,
        pointHitRadius: 10,
        data: [20, 15, 98, 4],
        scanGaps: false,
      }, {
        label: 'Meu segundo Dataset',
        fill: false,
        lineTension: 0.1,
        backgroundColor: 'rgb(117, 0, 49)',
        borderColor: 'rgb(51, 50, 46)',
        borderCapStyle: 'butt',
        borderJoinStyle: 'miter',
        pointRadius: 1,
        pointHitRadius: 10,
        data: [29, 135, 13, 70],
        scanGaps: false,
      }
    ]
    };

    return this.getChart(this.lineCanvas.nativeElement, 'line', data);
  }

  getPieChart() {
    const data = {
      labels: ['Homens', 'Mulheres'],
      datasets: [{
        data: [40, 75],
        backgroundColor: ['lightblue', 'yellow']
      }]
    };

    return this.getChart(this.pieCanvas.nativeElement, 'pie', data);
  }

  getDoughnutChart() {
    const data = {
      labels: ['Vermelho', 'Azul', 'Amarelo'],
      datasets: [{
        label: 'Teste Chart',
        data: [12, 65, 32],
        backgroundColor: [
          'rgb(0, 244, 97)',
          'rgb(37, 39, 43)',
          'rgb(255, 207, 0)'
        ]
      }]
    };

    return this.getChart(this.doughnutCanvas.nativeElement, 'doughnut', data);
  }





}

import { Component, OnInit, ViewChild } from "@angular/core";
import Chart from "chart.js";
import { Router, ActivatedRoute } from "@angular/router";
import { EndpointsService } from "../services/config/endpoints.service";

@Component({
  selector: "app-dashboard",
  templateUrl: "./dashboard.component.html",
  styleUrls: ["./dashboard.component.css"]
})
export class DashboardComponent implements OnInit {
  myplaceHolder = "Filter";
  filterStatus = "Activate";
  filterColumn = "Date";
  filterSearch;
  totalItemCount = 0;
  dateFilter = { from: "", to: "" };
  paginationUrl = {
    next: "",
    prev: "",
    viewCountStart: 1,
    viewCountEnd: 10
  };
  pageNumber = 1;
  dataSourceOrder = [];
  filterValue = "";
  public clicked; clicked1; clicked2; clicked3

  reportArray: any = {
    total_users: 0,
    total_products: 0,
    completed_orders: 0,
    pending_orders: 0,
    daily_orders: [],
    weekly_orders: [],
    monthly_orders: [],
    yearly_orders: [],
    daily_sales: []
  };

  public canvas: any;
  public ctx;
  public datasets: any;
  public data: any;
  public myChartData;
  public myChartData2;
  chartView = "Daily Report ";

  constructor(
    private router: Router,
    private endpoints: EndpointsService,
    private route: ActivatedRoute
  ) {
    this.getOrders();
  }

  private getReport() {
    const api = this.endpoints.dashboardUrl.report;
    this.endpoints.fetch(api).subscribe((res: any) => {
      const {
        data,
        data: { daily_orders, daily_sales }
      } = res;
      this.reportArray = data;
      const chartReport1 = this.extractReportForChart1(daily_orders);
      console.log(res, "chrtRep");
      this.myChartData.data.labels = chartReport1.labels;
      this.myChartData.data.datasets[0].data = chartReport1.count;
      this.myChartData.data.datasets[0].label = "Daily Report";
      this.myChartData.update();

      //Chart 2
      const chartReport2 = this.extractReportForChart2(daily_sales);
      // console.log(chartReport2, "chrtRep");
      this.myChartData2.data.labels = chartReport2.labels;
      this.myChartData2.data.datasets[0].data = chartReport2.amount;
      this.myChartData2.update();
    });
  }

  private extractReportForChart1(dataArrayObject) {
    const result = {
      count: [],
      labels: []
    };
    for (const iterator of dataArrayObject) {
      result.count.push(iterator.count);
      result.labels.push(iterator.label);
    }
    return result;
  }

  private extractReportForChart2(dataArrayObject) {
    const result = {
      amount: [],
      labels: []
    };
    for (const iterator of dataArrayObject) {
      result.amount.push(iterator.amount);
      result.labels.push(iterator.label);
    }
    return result;
  }

  private getOrders() {
    const apiUrl = `${this.endpoints.ordersUrl.getViewOrders}/list`;
    this.endpoints.fetch(apiUrl).subscribe(res => {
      // console.log(res, "orders");
      this.setDataSource(res);
    });
  }

  private setDataSource(res) {
    const {
      data,
      links: { next, prev, first, last },
      meta: { total }
    } = res;
    this.totalItemCount = total;
    // set pagination next, previous and page counts values
    this.paginationUrl = { ...this.paginationUrl, next, prev };
    // check if page is the lastnext, then set page count to total item count
    this.paginationUrl.next !== null
      ? this.paginationUrl
      : (this.paginationUrl.viewCountEnd = this.totalItemCount);
    // check if page is the lastprevious, then set page count to perPage count[10]
    this.paginationUrl.prev !== null
      ? this.paginationUrl
      : (this.paginationUrl.viewCountEnd = 10);
    // check if page is the single, then set page count to perPage count[count]
    total > this.paginationUrl.viewCountEnd
      ? this.paginationUrl
      : (this.paginationUrl.viewCountEnd = total);
    this.dataSourceOrder = data;
  }

  // outside clicks
  public updateOptions(type) {
    let chartReport: any;
    if (type === "daily") {
      chartReport = this.extractReportForChart1(this.reportArray.daily_orders);
    } else if (type === "weekly") {
      chartReport = this.extractReportForChart1(this.reportArray.weekly_orders);
    } else if (type === "monthly") {
      chartReport = this.extractReportForChart1(
        this.reportArray.monthly_orders
      );
    } else if (type === "yearly") {
      chartReport = this.extractReportForChart1(this.reportArray.yearly_orders);
    }
    this.myChartData.data.labels = chartReport.labels;
    this.myChartData.data.datasets[0].label = `${type} Report `;
    this.myChartData.data.datasets[0].data = chartReport.count;
    this.myChartData.update();
    this.chartView = `${type} Report `;
  }

  ngOnInit() {
    this.buildChart();
  }

  handleDateFilter(value, type) {
    if (type === "from") {
      this.dateFilter.from = value;
    } else {
      this.dateFilter.to = value;
    }
    // console.log(this.dateFilter, "lol");
    if (this.dateFilter.from && this.dateFilter.to) {
      const apiUrl = `${this.endpoints.ordersUrl.searchOrders}/search?q=${this.filterValue}&perPage=10&${this.dateFilter.from}/${this.dateFilter.to}`;
      this.endpoints.fetch(apiUrl).subscribe(res => {
        // console.log(res, "datefilter");
        this.setDataSource(res);
      });
    }
  }

  applyFilter(filterValue: string) {
    if (filterValue) {
      this.filterValue = filterValue;
      const apiUrl = `${
        this.endpoints.ordersUrl.searchOrders
      }q=${filterValue.toLowerCase()}&perPage=10`;
      this.endpoints.fetch(apiUrl).subscribe(res => {
        // console.log(res, "filted res");
        res !== null ? this.setDataSource(res) : (this.dataSourceOrder = []);
      });
    } else {
      this.getOrders();
      this.paginationUrl = {
        next: "",
        prev: "",
        viewCountStart: 1,
        viewCountEnd: 10
      };
    }
  }

  handleReloadOnPagination(pageNumber) {
    console.log(pageNumber, "hlo");
    this.endpoints
      .fetchPaginationPage(
        `https://api.natanmarket.com/api/v1/super/orders/list?perPage=10&page=${pageNumber}`
      )
      .subscribe(res => {
        console.log(res, "pagenate reload pageNumber");
        this.paginationUrl = {
          ...this.paginationUrl,
          viewCountStart: 10 * pageNumber + 1 - 10,
          viewCountEnd: 10 * pageNumber
        };
        this.setDataSource(res);
      });
  }

  handleNavigationView(id) {
    let redirect = "";
    this.route.snapshot.url.forEach((res: any) => {
      redirect += res.path + "/";
    });
    this.router.navigate([`/ordersInsight/view`, id], {
      queryParams: { redirectTo: redirect }
    });
  }

  hidShowPlaceHolder(value, type) {
    if (type === "onFocus" || value) {
      this.myplaceHolder = "";
      return;
    } else if (type === "onBlur" && !value) {
      this.myplaceHolder = "Filter";
      return;
    }
  }

  handleDateFilterActivation() {
    if (this.filterStatus === "Activate") {
      this.filterStatus = "Deactivate";
    } else {
      this.filterStatus = "Activate";
      // this.getTransactions();
      this.paginationUrl = {
        next: "",
        prev: "",
        viewCountStart: 1,
        viewCountEnd: 10
      };
    }
  }

  handlePagination(type) {
    let url: string;
    if (type === "next") {
      url = this.paginationUrl.next;
    } else if (type === "previous") {
      url = this.paginationUrl.prev;
    }
    const pageNumberIndex = url.indexOf("page=") + 5;
    // set pagenavigation to 1 on last previous -> indexOf will give wrong value
    const pageNumber = url.includes("page=")
      ? url.substring(pageNumberIndex)
      : 1;
    this.router.navigate(["/ordersInsight/pages/", pageNumber]);
  }

  handleDashboardHeadNav(type) {
    let page = type;
    this.router.navigate([`/adminDashboard/list`], {
      queryParams: { viewpage: page }
    });
  }

  private buildChart() {
    var gradientChartOptionsConfigurationWithTooltipRed: any = {
      maintainAspectRatio: false,
      legend: {
        display: false
      },

      tooltips: {
        backgroundColor: "#f5f5f5",
        titleFontColor: "#333",
        bodyFontColor: "#666",
        bodySpacing: 4,
        xPadding: 12,
        mode: "nearest",
        intersect: 0,
        position: "nearest"
      },
      responsive: true,
      scales: {
        yAxes: [
          {
            barPercentage: 1.6,
            gridLines: {
              drawBorder: false,
              color: "rgba(29,140,248,0.0)",
              zeroLineColor: "transparent"
            },
            ticks: {
              suggestedMin: 60,
              suggestedMax: 125,
              padding: 20,
              fontColor: "#9a9a9a"
            }
          }
        ],

        xAxes: [
          {
            barPercentage: 1.6,
            gridLines: {
              drawBorder: false,
              color: "rgba(233,32,16,0.1)",
              zeroLineColor: "transparent"
            },
            ticks: {
              padding: 20,
              fontColor: "#9a9a9a"
            }
          }
        ]
      }
    };

    var gradientBarChartConfiguration: any = {
      maintainAspectRatio: false,
      legend: {
        display: false
      },

      tooltips: {
        backgroundColor: "#f5f5f5",
        titleFontColor: "#333",
        bodyFontColor: "#666",
        bodySpacing: 4,
        xPadding: 12,
        mode: "nearest",
        intersect: 0,
        position: "nearest"
      },
      responsive: true,
      scales: {
        yAxes: [
          {
            gridLines: {
              drawBorder: false,
              color: "rgba(29,140,248,0.1)",
              zeroLineColor: "transparent"
            },
            ticks: {
              suggestedMin: 60,
              suggestedMax: 120,
              padding: 20,
              fontColor: "#9e9e9e"
            }
          }
        ],

        xAxes: [
          {
            gridLines: {
              drawBorder: false,
              color: "rgba(29,140,248,0.1)",
              zeroLineColor: "transparent"
            },
            ticks: {
              padding: 20,
              fontColor: "#9e9e9e"
            }
          }
        ]
      }
    };

    // First Chart Starts
    var chart_labels = [];
    this.datasets = [
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    ];
    this.data = this.datasets[0];

    this.canvas = document.getElementById("canvas22");
    this.ctx = this.canvas.getContext("2d");

    var gradientStroke = this.ctx.createLinearGradient(0, 230, 0, 50);

    gradientStroke.addColorStop(1, "rgba(241,131,14,1)");
    gradientStroke.addColorStop(0.4, "rgba(233,32,16,0.0)");
    gradientStroke.addColorStop(0, "rgba(233,32,16,0)"); //red colors

    var config = {
      type: "line",
      data: {
        labels: chart_labels,
        datasets: [
          {
            label: "My First dataset",
            fill: true,
            backgroundColor: gradientStroke,
            borderColor: "#ec250d",
            borderWidth: 2,
            borderDash: [],
            borderDashOffset: 0.0,
            pointBackgroundColor: "#ec250d",
            pointBorderColor: "rgba(255,255,255,0)",
            pointHoverBackgroundColor: "#ec250d",
            pointBorderWidth: 20,
            pointHoverRadius: 4,
            pointHoverBorderWidth: 15,
            pointRadius: 4,
            data: this.data
          }
        ]
      },
      options: gradientChartOptionsConfigurationWithTooltipRed
    };

    this.myChartData = new Chart(this.ctx, config);
    // First Chart End

    // Second Chart Starts
    this.canvas = document.getElementById("CountryChart");
    this.ctx = this.canvas.getContext("2d");
    var gradientStroke = this.ctx.createLinearGradient(0, 230, 0, 50);

    gradientStroke.addColorStop(1, "rgba(29,140,248,0.2)");
    gradientStroke.addColorStop(0.4, "rgba(29,140,248,0.0)");
    gradientStroke.addColorStop(0, "rgba(29,140,248,0)"); //blue colors

    this.myChartData2 = new Chart(this.ctx, {
      type: "bar",
      legend: {
        display: false
      },
      data: {
        labels: [],
        datasets: [
          {
            label: "Daily Sales",
            backgroundColor: "#3e95cd",
            data: [133, 221, 783, 2478]
          }
        ]
      },
      options: gradientBarChartConfiguration
    });
    // Second Chart Ends

    // fetch chart report
    this.getReport();
  }
}

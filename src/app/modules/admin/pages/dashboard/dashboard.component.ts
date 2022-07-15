import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, SimpleChanges, ViewChild, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { map, Observable, Subject, takeUntil } from 'rxjs';
import { ApexOptions } from 'ng-apexcharts';
import { DashboardService } from './dashboard.service';
import { UserService } from 'app/services/user/user.service';
import { User } from 'app/services/user/user.types';
import { DashboardType } from 'app/services/dashboard/dashboard.types';
import { TranslocoService } from '@ngneat/transloco';

@Component({
    selector       : 'dashboard',
    templateUrl    : './dashboard.component.html',
    encapsulation  : ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardComponent implements OnInit, OnDestroy, AfterViewInit 
{
    chartUsedStorage: ApexOptions;
    chartImageCount: ApexOptions;
    data: any;

    selectedDashboard: string = 'ACME Corp. Backend App';
    user: User;
    dashboardData: DashboardType = {
        eventStatistics:{
            accessToExternalEvents:0,
            totalEvents           :0,
            totalPrivateEvents    :0,
            totalPublicEvents     :0,
            totalSharedEvents     :0
        },
        userStatistics:{
            allowedImageCount   : 0,
            allowedStorage      : 0,
            sizeUnit            : '',
            totalImageCount     : 0,
            usedStorage         : 0
        }
    };
    
    private _unsubscribeAll: Subject<any> = new Subject<any>();

    @ViewChild('nameElement') myDiv: ElementRef;

    /**
     * Constructor
     */
    constructor(
        private dashboardService: DashboardService,
        private _router: Router,
        private _userService: UserService,
        private t: TranslocoService,
        private _changeDetectorRef: ChangeDetectorRef,

    )
    { 
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
   
    ngOnInit(): void
    {
        this.getUserData();
        this.getDashboardData();
        this._prepareChartData();
    }

    getUserData(): void{
        this._userService.getUserById().subscribe();
        this._userService.user$
        .pipe(takeUntil(this._unsubscribeAll))
        .subscribe((data: User)=>{this.user = data,
            this._changeDetectorRef.markForCheck();
        });
    }

    getDashboardData(): void {
        this.dashboardService.getData();
        this.dashboardService.data$
        .pipe(takeUntil(this._unsubscribeAll))
        .subscribe((data)=> {
            this.dashboardData = data;
        });
    }

    ngAfterViewInit() {
        if(!this.user){
            this._userService.getUserById().subscribe(u=> this.myDiv.nativeElement.innerHTML= `${this.t.translate('welcome-back')}, ${u.firstName} ${u.lastName}`)
        }
    }
    
    /**
     * On destroy
     */
    ngOnDestroy(): void
    {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Track by function for ngFor loops
     *
     * @param index
     * @param item
     */
    trackByFn(index: number, item: any): any
    {
        return item.id || index;
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Private methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Prepare the chart data from the data
     *
     * @private
     */
    private _prepareChartData(): void
    {
        // UserStatics
        const allowedStorageInPercentage = this.percentage(this.dashboardData.userStatistics.allowedStorage, this.dashboardData.userStatistics.allowedStorage)- this.percentage(this.dashboardData.userStatistics.usedStorage, this.dashboardData.userStatistics.allowedStorage);
        const usedStorageInPercentage = this.percentage(this.dashboardData.userStatistics.usedStorage, this.dashboardData.userStatistics.allowedStorage);
       
        const allowedImageCountInPercentage = this.percentage(this.dashboardData.userStatistics.allowedImageCount, this.dashboardData.userStatistics.allowedImageCount) - this.percentage(this.dashboardData.userStatistics.totalImageCount, this.dashboardData.userStatistics.allowedImageCount)
        const totalImageCountInPercentage = this.percentage(this.dashboardData.userStatistics.totalImageCount, this.dashboardData.userStatistics.allowedImageCount);
        const analytics = {
            usedStorage: { 
                series: [allowedStorageInPercentage, usedStorageInPercentage],
                chartData: [{data : this.dashboardData.userStatistics.allowedStorage, progress: allowedStorageInPercentage},
                            {data : this.dashboardData.userStatistics.usedStorage, progress: usedStorageInPercentage}],
                labels: [
                    'Allowed Storage',
                    'Used Storage'
                ]
            },
            imageCount: {
                series    : [allowedImageCountInPercentage, totalImageCountInPercentage],
                chartData : [{data : this.dashboardData.userStatistics.allowedImageCount, progress: allowedImageCountInPercentage},
                             {data : this.dashboardData.userStatistics.totalImageCount, progress: totalImageCountInPercentage}],
                labels        : [
                    'Allowed Images',
                    'Total Images'
                ]
            }
        };
      this.data =  analytics;

         // chartUsedStorage
         this.chartUsedStorage = {
            chart      : {
                animations: {
                    speed           : 400,
                    animateGradually: {
                        enabled: false
                    }
                },
                fontFamily: 'inherit',
                foreColor : 'inherit',
                height    : '100%',
                type      : 'donut',
                sparkline : {
                    enabled: true
                }
            },
            colors     : ['#3182CE', '#63B3ED'],
            labels     : this.data.usedStorage.labels,
            plotOptions: {
                pie: {
                    customScale  : 0.9,
                    expandOnClick: false,
                    donut        : {
                        size: '70%'
                    }
                }
            },
            series     : this.data.usedStorage.series,
            states     : {
                hover : {
                    filter: {
                        type: 'none'
                    }
                },
                active: {
                    filter: {
                        type: 'none'
                    }
                }
            },
            tooltip    : {
                enabled        : true,
                fillSeriesColor: false,
                theme          : 'dark',
                custom         : ({
                                      seriesIndex,
                                      w
                                  }): string => `<div class="flex items-center h-8 min-h-8 max-h-8 px-3">
                                                    <div class="w-3 h-3 rounded-full" style="background-color: ${w.config.colors[seriesIndex]};"></div>
                                                    <div class="ml-2 text-md leading-none">${w.config.labels[seriesIndex]}:</div>
                                                    <div class="ml-2 text-md font-bold leading-none">${w.config.series[seriesIndex]}%</div>
                                                </div>`
            }
        };

         // chartImageCount
         this.chartImageCount = {
            chart      : {
                animations: {
                    speed           : 400,
                    animateGradually: {
                        enabled: false
                    }
                },
                fontFamily: 'inherit',
                foreColor : 'inherit',
                height    : '100%',
                type      : 'donut',
                sparkline : {
                    enabled: true
                }
            },
            colors     : ['#319795', '#4FD1C5'],
            labels     : this.data.imageCount.labels,
            plotOptions: {
                pie: {
                    customScale  : 0.9,
                    expandOnClick: false,
                    donut        : {
                        size: '70%'
                    }
                }
            },
            series     : this.data.imageCount.series,
            states     : {
                hover : {
                    filter: {
                        type: 'none'
                    }
                },
                active: {
                    filter: {
                        type: 'none'
                    }
                }
            },
            tooltip    : {
                enabled        : true,
                fillSeriesColor: false,
                theme          : 'dark',
                custom         : ({
                                      seriesIndex,
                                      w
                                  }): string => `<div class="flex items-center h-8 min-h-8 max-h-8 px-3">
                                                     <div class="w-3 h-3 rounded-full" style="background-color: ${w.config.colors[seriesIndex]};"></div>
                                                     <div class="ml-2 text-md leading-none">${w.config.labels[seriesIndex]}:</div>
                                                     <div class="ml-2 text-md font-bold leading-none">${w.config.series[seriesIndex]}%</div>
                                                 </div>`
            }
        };
    }
    percentage(value, total)
    {
        if(value == 0 && total == 0)
            return 0;
        return parseFloat(((value/total)*100).toFixed(2))
    }
}

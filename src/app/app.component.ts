import { Component, OnInit } from '@angular/core';
import { environment } from 'environments/environment';

@Component({
    selector   : 'app-root',
    templateUrl: './app.component.html',
    styleUrls  : ['./app.component.scss']
})
export class AppComponent implements OnInit
{
    cookieMessage = 'This website uses cookies to ensure you get the best experience on our website. ';
    cookieDismiss = 'Got it!';
    cookieLinkText = 'Learn more';
    /**
     * Constructor
     */
    constructor()
    {
    }
    ngOnInit(): void {
        let cc = window as any;
        cc.cookieconsent.initialise({
        "palette": {
            "popup": {
                "background": "#343c66",
                "text": "#cfcfe8"
            },
            "button": {
                "background": "#f71559"
            }
            },
          "type": "opt-in",
          theme: "classic",
         //  "position": "bottom-left",
         revokable: false,
          content: {
            message: this.cookieMessage,
            dismiss: this.cookieDismiss,
            link: this.cookieLinkText,
            allow: 'Allow cookies',
            deny: 'Decline',
            href: `${environment.siteUrl}privacy`, 
            "header": 'Cookies used on the website!',
            "close": '&#x274c;',
            "policy": 'Cookie Policy',
            "target": '_blank',
          }
        });
    }
}

// import { Component } from '@angular/core';
// import { RssFeedService } from '../_services/rss-feed.service';
// import { CommonModule } from '@angular/common';

// @Component({
//   selector: 'app-rss',
//   standalone: true,
//   imports: [CommonModule],
//   templateUrl: './rss.component.html',
//   styleUrl: './rss.component.css'
// })
// export class RssComponent {
//   feedItems: any[] = [];
//   feedUrl: string = 'https://feeds.feedburner.com/autonews/RetailNews';  

//   constructor(private rssFeedService: RssFeedService) {}

//   ngOnInit(): void {
//     this.loadFeed();
//   }

//   async loadFeed() {
//     this.rssFeedService.getFeed(this.feedUrl).subscribe({
//       next: (feed:any) => {
//         this.feedItems = feed.items || []; // Assuming 'items' is the key for feed items
//       },
//       error: (error: any) => {
//         console.error('Error fetching feed:', error);
//       }
//     });
//   }

// }

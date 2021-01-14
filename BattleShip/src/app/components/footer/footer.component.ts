import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {

  currentYear: number;
  githubRepoLink: string;

  constructor() { }

  ngOnInit(): void {
    this.currentYear = new Date().getUTCFullYear();
    this.githubRepoLink = "https://github.com/rxs-99/battleship";
  }

}

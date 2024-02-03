import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  TOPICS = [
    {
        title: 'Login',
        subsections: [],
        route: '/investiment'
    },
    {
        title: 'Portfolio',
        subsections: [],
        route: '/portfolio'
    },
    {
        title: 'Contacts',
        subsections: [],
        route: '/contact'
    },
]

  constructor() { }

  ngOnInit(): void {
  }

}

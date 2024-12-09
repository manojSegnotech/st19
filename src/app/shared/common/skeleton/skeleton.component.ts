import { Component, Input, OnInit } from '@angular/core';
import { NgForOf } from '@angular/common';

@Component({
  selector: 'app-skeleton',
  imports: [NgForOf],
  templateUrl: './skeleton.component.html',
  styleUrl: './skeleton.component.scss'
})
export class SkeletonComponent implements OnInit{
  skeletons :any[] = []
  @Input() items = 12
  @Input() layout = 4
  constructor(){}

  ngOnInit(): void {
    this.skeletons=Array(this.items).fill('')
  }
}

import { Component, OnInit } from '@angular/core';
import { concat, Subscription } from 'rxjs';
import { PokemonService } from 'src/app/services/pokemon.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {

  loading: boolean = false;

  subscriptions: Subscription[] = [];

  constructor(private pokemonService: PokemonService) { }

  get pokemons(): any[] {
    return this.pokemonService.pokemons;
  }

  set subscription(subscription: Subscription) {
    this.subscriptions.push(subscription);
  }

  ngOnInit(): void {
    if (!this.pokemons.length) {
      this.loadMore();
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => subscription ? subscription.unsubscribe() : 0);
  }

  loadMore(): void {
    this.loading = true;
    this.subscription = this.pokemonService.getNext().subscribe((response: { next: any; results: any[]; }) => {
      this.pokemonService.next = response.next;
      const details = response.results.map((i: any) => this.pokemonService.get(i.name));
      this.subscription = concat(...details).subscribe((response: any) => {
        this.pokemonService.pokemons.push(response);
      });
    }, (error: any) => console.log('Error Occurred:', error), () => this.loading = false);
  }

  getType(pokemon: any): string {
    return this.pokemonService.getType(pokemon);
  }
  getID(pokemon: any): number {
    return this.getID(pokemon);
  }

  // public pokemon!: Pokemon;

  // public leadingZero(srt: string | number, size: number = 3 ) : string {
  //   let s = String(srt);
  //   while (s.length < (size || 2))
  //   {
  //     s = '0' + s;
  //   }
  //   return s;
  // }

}

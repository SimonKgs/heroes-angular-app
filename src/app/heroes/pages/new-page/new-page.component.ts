import { Component, OnInit, Pipe } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Hero, Publisher } from '../../interfaces/hero.interface';
import { HeroesService } from '../../services/heroes.service';
import { ActivatedRoute, Router } from '@angular/router';
import { filter, switchMap, tap } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../components/confirmDialog/confirmDialog.component';

@Component({
  selector: 'app-new-page',
  templateUrl: './new-page.component.html',
  styleUrls: ['./new-page.component.css']
})
export class NewPageComponent implements OnInit{

  public heroForm = new FormGroup({
    id: new FormControl<string>(''),
    superhero: new FormControl<string>('', { nonNullable: true }),
    publisher: new FormControl<Publisher>( Publisher.DCComics ),
    alter_ego: new FormControl<string>(''),
    first_appearance: new FormControl<string>(''),
    characters: new FormControl<string>(''),
    alt_img: new FormControl<string>(''),
  })

  public publishers = [
    { id: 'DC Comics', value: 'DC - Comics' },
    { id: 'Marvel Comics', value: 'Marvel - Comics' }
  ]

  constructor(
    private  heroesService: HeroesService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private snackbar: MatSnackBar,
    private dialog: MatDialog,
  ) {}

  ngOnInit(): void {

    if ( !this.router.url.includes('edit')) return

    this.activatedRoute.params
      .pipe(
        switchMap( ({ id }) => this.heroesService.getHeroeById( id ))
      ).subscribe( hero => {

        if ( !hero ) this.router.navigateByUrl('/')

        this.heroForm.reset( hero )
        return;
      })

  }

  get currentHero(): Hero {
    const hero = this.heroForm.value as Hero;
    return hero;
  }

  onSubmit():void {
    if ( this.heroForm.invalid ) return;


    if (this.currentHero.id ) {
      this.heroesService.updateHero( this.currentHero )
        .subscribe( hero => {
          this.showSnackbar(`${ hero.superhero } updated!`)
        })
        return
    }

    this.heroesService.addHero( this.currentHero )
      .subscribe( hero => {
        this.router.navigate(['/heroes/edit', hero.id])
        this.showSnackbar(`${ hero.superhero } created!`)
      })
  }


  onDeleteHero() {
    if ( !this.currentHero.id) throw Error('Hero id is requiered');

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: this.heroForm.value
    })

    dialogRef.afterClosed()
    .pipe(
      filter( (result: boolean) => result),
      switchMap( () => this.heroesService.deleteHeroById( this.currentHero.id )),
      filter(  (wasDeleted: boolean) => wasDeleted)
    )
    .subscribe( () => {
      this.router.navigateByUrl('/heroes')
    })

  }


  showSnackbar( message: string):void {
    this.snackbar.open( message, 'done', {
      duration: 2500
    })
  }

}

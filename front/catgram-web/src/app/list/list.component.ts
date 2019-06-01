import { Component, OnInit } from '@angular/core';
import { AppService } from '../app.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService} from 'ngx-toastr';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
  providers: [AppService]
})
export class ListComponent implements OnInit {

  cats = [];
  onFavs = false;
  selectedCat = {
    id: '',
    url: '',
    fav: false,
    fav_id: ''
  };

  secondRow = false;
  searchTerm = '';
  breeds = [];
  dbCats = [];

  searchResults = [];

  constructor(private apiService: AppService, private modalService: NgbModal, private toastrService: ToastrService) {
   }

  ngOnInit() {
    this.searchCats('all');
    this.onFavs = false;
  }

  getDbCats() {
    this.apiService.getCats()
      .subscribe((response) => {
        this.dbCats = response;
        this.cats.forEach((cat) => {
          const present = this.dbCats.some((c) => c.id === cat.id);
          if (present) {
            this.cats['fav'] = true;
          } else {
            this.cats['fav'] = false;
          }
        });
      }, (e) => {
        console.error(e);
      });
  }

  openModal(modal, url, id, fav, fav_id) {

    this.selectedCat.id = id;
    this.selectedCat.url = url;
    this.selectedCat.fav = fav;
    this.selectedCat.fav_id = fav_id;

    const modalvar = this.modalService.open(modal);
    modalvar.result.then(() => { console.log('When user cl5oses'); }, () => { this.updateCats()});
    console.log(this.dbCats);
  }


  doubleClick(d) {
    if (this.selectedCat.fav !== true) {
      this.selectedCat.fav = true;
    } else {
      this.selectedCat.fav = false;
    }
  }

  updateCats() {

    // check if changes

    const cat = this.cats.find((c) => c.id === this.selectedCat.id);

    if (cat.fav === this.selectedCat.fav) {
      console.log('no changes');
      return;
    }
    const data = {
      id: this.selectedCat.id,
      fav: this.selectedCat.fav,
      fav_id: this.selectedCat.fav_id
    };

    console.log(data);

    if (!this.selectedCat.fav) {
      this.deleteFav(data);
    } else {
      this.addFav(data);
    }
  }
  showFavs() {

    this.apiService.getFavs()
      .subscribe((res) => {

        this.cats = res.map((r) => { return {
          id: r.image.id,
          url: r.image.url,
          fav: true,
          fav_id: r.id
        };
        });

        this.onFavs = true;
      }, (e) => {
        console.error(e);
      });
  }

  onClose(d) {
    d();
  }

  deleteFav(data) {
    const rqData = {
      fav_id: '',
      sub_id: 'user123'
    };

    if (this.onFavs) {
      rqData.fav_id = data.fav_id;
    } else {
      rqData.fav_id = this.dbCats.find((c) => c.id === data.id).fav_id;
    }
    this.cats.find((c) => c.id === data.id).fav = false;
    this.apiService.deleteFav(rqData)
      .subscribe((res) => {
        console.log('fav deleted');
        data.fav_id = '';
        this.removeCatDb(data);
      }, (e) => {
        console.error(e);
      });
  }

  addFav(data) {
    const rqData = {
      image_id: data.id,
      sub_id: 'user123'
    };
    this.cats.find((c) => c.id === data.id).fav = true;
    this.apiService.addFav(rqData)
      .subscribe((res) => {
        console.log('fav added');
        data.fav_id = res.id;
        this.insertCatDb(data);
      }, (e) => {
        console.error(e);
      });
  }

  /* updateCatsDb(data) {

    const dbCat = this.dbCats.find((c) => c.fav_id === data.fav_id);

    if(!dbCat)
    this.apiService.updateCats(data)
      .subscribe((res) => {
        console.log('db updated');
        if (this.onFavs) {
          this.showFavs();
        }
      }, (e) => {
        console.error(e);
      });
  } */


  insertCatDb(data) {
    this.apiService.insertCat(data)
      .subscribe((res) => {
        console.log('cat inserted in DB');
        this.getDbCats();
      }, (e) => {
        console.error(e);
      });
  }

  removeCatDb(data) {
    this.apiService.deleteCat(data)
      .subscribe((res) => {
        console.log('cat deleted in DB');
        this.getDbCats();
        if (this.onFavs) {
          this.showFavs();
        }
      }, (e) => {
        console.error(e);
      });
  }

  showSecondRow() {
    this.secondRow = true;
  }

  onFilterKeyUp(ev) {
    this.searchTerm = ev.target.value;
    if (this.searchTerm.length < 1) {
        this.searchTerm = '';
    }
    if (this.searchTerm === '') {
      this.searchCats('all');
    }
    this.getBreeds(this.searchTerm);

}

  getBreedsTimeOut(term) {
    this.apiService.getBreedIds(term)
      .subscribe((res) => {
        this.breeds = res || [];
        this.cats = [];
        this.searchCats(this.breeds[0].breed_id);
      }, (e) => {
        console.error(e);
        this.toastrService.error('No results for your search');
      });
    }

  getBreeds(term) {
    setTimeout(() => { this.getBreedsTimeOut(term)}, 2000);
  }

  searchCats(breedId) {
    this.apiService.searchCats(breedId)
      .subscribe((res) => {
        this.cats = res;

        this.getDbCats();
        this.onFavs = false;
      }, (e) => {
        console.error(e);
      });
  }

  searchAppend(breedId) {
    this.apiService.searchCats(breedId)
      .subscribe((res) => {
        this.cats.push(res);
        this.getDbCats();
        this.onFavs = false;
      }, (e) => {
        console.error(e);
      });
  }
}


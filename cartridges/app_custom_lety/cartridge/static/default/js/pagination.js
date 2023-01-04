// Developed By Mike Fletes 🎸
// https://github.com/mfletesg

class Pagination {
  
  constructor() {
    this.listaMovimientos = []
    this.page = 1;
    this.rowsByPages = parseInt(document.getElementById("rowsSelect").value)
    this.arrayPagination = []
    this.totalPages = 1;
    this.totalRows = 0;
    this.rowStart = 0;
    this.rowEnd = 0;
    this.searchText = ''
    this.listaMovimientosFilter = []

    this.order = 'asc'
    this.printTable(null)
  }  


  getListMembers(){
    try {
      this.listaMovimientos = JSON.parse(document.getElementById('listaMovimientos').value)
    } catch (error) {
      console.log(error) 
      this.listaMovimientos = []
    }
    return this.listaMovimientos
  }


  printTable(search){

    this.listaMovimientosFilter = []
    if(search === null){
      this.listaMovimientosFilter = this.getListMembers()
    }
    else{
      console.log(search)
      this.listaMovimientosFilter = search
    }
    
    this.totalRows = this.listaMovimientosFilter.length
    this.generateVectorPagination(this.listaMovimientosFilter)

    if(this.totalPages < (this.page - 1)){
      this.page = 1;
    }

    let p = this.page - 1;
    let html = ''
    
    /* Era cero pero lo cambie a 1*/
    if(this.arrayPagination.length === 0){
      this.resetData()
      return false
    }

    if(this.arrayPagination[p].entries() === undefined){
      this.resetData()
      return false
    }

    //console.log(this.arrayPagination[p].entries().le);

    for (const [i, item] of this.arrayPagination[p].entries()) {
      if(i === 0){
        this.rowStart = item['count']
      }

      if(i === (this.arrayPagination[p].length - 1)){
        this.rowEnd = item['count']
      }
   
      html += `<tr class="tr-info">\
                <td>${item.dtFechaAplica}</td>\
                <td>${item.Centro}</td>\
                <td>${item.TipoMovimiento }</td>\
                <td>${item.Cargo}</td>\
                <td>${item.Abono}</td>\
                <td>${item.dSaldoAnterior}</td>\
              </tr>`;
    }
 
 
    document.getElementById("itemsListTable").innerHTML = html

    let cards = "";

    // -----------------------------------------------------------
    for (const [c, item] of this.arrayPagination[p].entries()) {
      cards += `<div class="card card-list" >\
                  <div class="card-body card-body-list">\
                    <h5 class="card-title card-title-list">Fecha Movimiento</h5>\
                    <p class="card-text card-text-list">${item.dtFechaAplica}</p>\
  
                    <h5 class="card-title card-title-list">Sucursal</h5>\
                    <p class="card-text card-text-list">${item.Centro}</p>\
  
                    <h5 class="card-title card-title-list">Descripción</h5>\
                    <p class="card-text card-text-list">${item.TipoMovimiento}</p>\
  
                    <h5 class="card-title card-title-list">Canjes</h5>\
                    <p class="card-text card-text-list">${item.Cargo}</p>\
  
                    <h5 class="card-title card-title-list">Abono</h5>\
                    <p class="card-text card-text-list">${item.Abono}</p>\
  
                    <h5 class="card-title card-title-list">Saldo</h5>\
                    <p class="card-text card-text-list">${item.dSaldoAnterior}</p>\
  
                  </div>\
                </div>`;
    } 
    // -----------------------------------------------------------
    document.getElementById("listCards").innerHTML = cards



    let btnPage = document.getElementById("btnNumPage")
    btnPage.value = this.page
    btnPage.textContent = this.page
    document.getElementById("textInfoPagination").textContent = `Mostrando registros del ${this.rowStart} al ${this.rowEnd} de un total de ${this.totalRows} registros`
    return true
  }


  generateVectorPagination(listaMovimientos){
    let count = 1;
    let page = []
    let numItemsVector = (listaMovimientos.length - 1)
    this.arrayPagination = []
  
    for (let i = 0; i < listaMovimientos.length; i++) {
      listaMovimientos[i]['count'] = (i + 1)
      page.push(listaMovimientos[i]);
      if(count % this.rowsByPages === 0){
        this.arrayPagination.push(page)
        page = [];
        count = 1;
      }
      else{
        if(numItemsVector === i){
          let position = i + (this.rowsByPages);
          if(listaMovimientos[position] === undefined){
            this.arrayPagination.push(page)
            break;
          }
        }
        count++;
      }
    }
    this.totalPages = (this.arrayPagination.length)
    return true
  }

  
  onChangeRows(e){
    var value = e.target.value;
    this.rowsByPages = parseInt(value);
    this.arrayPagination = []
    this.printTable(this.listaMovimientosFilter)
    return true
  }


  handleBtnNavigate(value){
    value = parseInt(value)
    switch (value) {
      case 1: // Anterior
        if(this.page === 1){
          return false
        }
        this.page = (this.page - 1)
        break;
      case 2: // Siguiente
        if(this.totalPages === this.page){
          return false;
        }
        this.page = (this.page + 1)
        break;    
      default:
        break;
    }
    this.printTable(this.listaMovimientosFilter)
    this.scrollTo(document.getElementById("rowsSelect"))
    return true
  }


  onChangeSearh(e){
    this.searchText = e.target.value;
    this.searchValues()
    return true
  }


  searchValues(){
    var search = new RegExp(this.searchText , 'i');

    //let res = this.listaMovimientos.filter(s => search.test(s.dSaldoAnterior))
    var result = this.listaMovimientos.filter(function(s) {
      if( search.test(s.dSaldoAnterior) === true || 
          search.test(s.count) === true || 
          search.test(s.TipoMovimiento) === true ||
          search.test(s.Abono) === true ||
          search.test(s.Centro) === true ||
          search.test(s.dtFechaAplica) === true ||
          search.test(s.Cargo) === true
          ){
        return true
      }
    })
    if(this.order === 'desc '){
      result = result.sort((a, b) => (a.dtFechaAplica > b.dtFechaAplica ? 1 : -1))
    }
    else{
      result = result.sort((a, b) => (a.dtFechaAplica > b.dtFechaAplica ? -1 : 1))
    }
    this.printTable(result)
    return true
  }


  orderItems(type){
    type = parseInt(type);
    const icon = document.getElementsByClassName('icon-order-table')
    let  itemHtml = null

    for (let i = 0; i < icon.length; i++) {
      if(type === i){
        itemHtml = icon[i]
      }
      else{
        icon[i].innerHTML = ''
      } 
    }

    let listOrder = null;
    let property = ''
    
    switch (type) {
      case 0:
        property = 'dtFechaAplica'
        break;
      case 1:
        property = 'Centro'
        break;
      case 2:
        property = 'TipoMovimiento'
        break;
      case 3:
        property = 'Cargo'
        break;
      case 4:
        property = 'Abono'
        break;
      case 5:
        property = 'dSaldoAnterior'
        break;    
      default:
        break;
    }

    if(this.order == 'asc'){
      console.log('asc')
      listOrder = this.listaMovimientosFilter.sort((a, b) => (a[property] > b[property] ? 1 : -1))
      itemHtml.innerHTML = '<svg class="icon-order" enable-background="new 0 0 32 32" height="32px" id="Layer_1" version="1.1" viewBox="0 0 32 32" width="32px" xml:space="preserve" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">\
                              <path d="M18.221,7.206l9.585,9.585c0.879,0.879,0.879,2.317,0,3.195l-0.8,0.801c-0.877,0.878-2.316,0.878-3.194,0  l-7.315-7.315l-7.315,7.315c-0.878,0.878-2.317,0.878-3.194,0l-0.8-0.801c-0.879-0.878-0.879-2.316,0-3.195l9.587-9.585  c0.471-0.472,1.103-0.682,1.723-0.647C17.115,6.524,17.748,6.734,18.221,7.206z" fill="#515151" />\
                            </svg>'
      this.order = 'desc'
    }
    else{
      console.log('desc')
      listOrder = this.listaMovimientosFilter.sort((a, b) => (a[property] > b[property] ? -1 : 1))
      itemHtml.innerHTML = '<svg class="icon-order" enable-background="new 0 0 32 32" height="32px" id="Layer_1" version="1.1" viewBox="0 0 32 32" width="32px" xml:space="preserve" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">\
                                <path d="M14.77,23.795L5.185,14.21c-0.879-0.879-0.879-2.317,0-3.195l0.8-0.801c0.877-0.878,2.316-0.878,3.194,0  l7.315,7.315l7.316-7.315c0.878-0.878,2.317-0.878,3.194,0l0.8,0.801c0.879,0.878,0.879,2.316,0,3.195l-9.587,9.585  c-0.471,0.472-1.104,0.682-1.723,0.647C15.875,24.477,15.243,24.267,14.77,23.795z" fill="#515151" />\
                            </svg>'
      this.order = 'asc'

      
    }        
    this.page = 1;
    this.printTable(listOrder)
    return true
  }


  resetData(){
    document.getElementById("itemsListTable").innerHTML = ''
    document.getElementById("listCards").innerHTML = ''
    this.totalRows = 0;
    this.rowStart = 0;
    this.rowEnd = 0;
    document.getElementById("textInfoPagination").textContent = `Mostrando registros del ${this.rowStart} al ${this.rowEnd} de un total de ${this.totalRows} registros`
  }


  scrollTo(element){
    window.scroll({ behavior: 'smooth', left: 0, top: element.offsetTop });
  }


}


const pagination = new Pagination();

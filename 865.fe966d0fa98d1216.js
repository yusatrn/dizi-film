"use strict";(self.webpackChunkfilm_dizi_oneri=self.webpackChunkfilm_dizi_oneri||[]).push([[865],{2865:(x,l,r)=>{r.r(l),r.d(l,{HomeComponent:()=>b});var s=r(177),c=r(5776),m=r(5312),t=r(4438),d=r(1863);const _=n=>["/detay","film",n],p=n=>["/detay","dizi",n];function g(n,o){1&n&&(t.j41(0,"div",8)(1,"div",9)(2,"span",10),t.EFF(3,"Y\xfckleniyor..."),t.k0s()()())}function u(n,o){if(1&n&&(t.j41(0,"div",11),t.EFF(1),t.k0s()),2&n){const e=t.XpG();t.R7$(),t.SpI(" ",e.error," ")}}function v(n,o){if(1&n&&t.nrm(0,"img",30),2&n){const e=t.XpG().$implicit,i=t.XpG(2);t.Y8G("src",i.imageBaseUrl+"w300"+e.poster_path,t.B4B)("alt",e.title)}}function f(n,o){1&n&&(t.j41(0,"div",31)(1,"span"),t.EFF(2,"G\xf6rsel Yok"),t.k0s()())}function h(n,o){if(1&n&&(t.j41(0,"div",21)(1,"div",22),t.DNE(2,v,1,2,"img",23)(3,f,3,0,"ng-template",null,0,t.C5r),t.j41(5,"div",24)(6,"h5",25),t.EFF(7),t.k0s(),t.j41(8,"div",26)(9,"span",27),t.EFF(10),t.nI1(11,"number"),t.k0s()(),t.j41(12,"p",28),t.EFF(13),t.nI1(14,"date"),t.k0s(),t.j41(15,"a",29),t.EFF(16,"Detaylar"),t.k0s()()()()),2&n){const e=o.$implicit,i=t.sdS(4);t.R7$(2),t.Y8G("ngIf",e.poster_path)("ngIfElse",i),t.R7$(5),t.JRh(e.title),t.R7$(3),t.JRh(t.i5U(11,6,e.vote_average,"1.1-1")),t.R7$(3),t.JRh(t.i5U(14,9,e.release_date,"yyyy")),t.R7$(2),t.Y8G("routerLink",t.eq3(12,_,e.id))}}function F(n,o){if(1&n&&t.nrm(0,"img",30),2&n){const e=t.XpG().$implicit,i=t.XpG(2);t.Y8G("src",i.imageBaseUrl+"w300"+e.poster_path,t.B4B)("alt",e.name)}}function C(n,o){1&n&&(t.j41(0,"div",31)(1,"span"),t.EFF(2,"G\xf6rsel Yok"),t.k0s()())}function E(n,o){if(1&n&&(t.j41(0,"div",21)(1,"div",22),t.DNE(2,F,1,2,"img",23)(3,C,3,0,"ng-template",null,0,t.C5r),t.j41(5,"div",24)(6,"h5",25),t.EFF(7),t.k0s(),t.j41(8,"div",26)(9,"span",27),t.EFF(10),t.nI1(11,"number"),t.k0s()(),t.j41(12,"p",28),t.EFF(13),t.nI1(14,"date"),t.k0s(),t.j41(15,"a",29),t.EFF(16,"Detaylar"),t.k0s()()()()),2&n){const e=o.$implicit,i=t.sdS(4);t.R7$(2),t.Y8G("ngIf",e.poster_path)("ngIfElse",i),t.R7$(5),t.JRh(e.name),t.R7$(3),t.JRh(t.i5U(11,6,e.vote_average,"1.1-1")),t.R7$(3),t.JRh(t.i5U(14,9,e.first_air_date,"yyyy")),t.R7$(2),t.Y8G("routerLink",t.eq3(12,p,e.id))}}function k(n,o){if(1&n&&(t.j41(0,"section")(1,"h2",12),t.EFF(2,"Pop\xfcler Filmler"),t.k0s(),t.j41(3,"div",13),t.DNE(4,h,17,14,"div",14),t.k0s(),t.j41(5,"h2",15),t.EFF(6,"Pop\xfcler Diziler"),t.k0s(),t.j41(7,"div",13),t.DNE(8,E,17,14,"div",14),t.k0s(),t.j41(9,"div",16)(10,"div",17)(11,"a",18),t.EFF(12,"T\xfcm Filmleri G\xf6r"),t.k0s()(),t.j41(13,"div",19)(14,"a",20),t.EFF(15,"T\xfcm Dizileri G\xf6r"),t.k0s()()()()),2&n){const e=t.XpG();t.R7$(4),t.Y8G("ngForOf",e.popularMovies),t.R7$(4),t.Y8G("ngForOf",e.popularTvShows)}}let b=(()=>{class n{constructor(e){this.contentService=e,this.popularMovies=[],this.popularTvShows=[],this.imageBaseUrl=m.c.imageBaseUrl,this.isLoading=!0,this.error=null}ngOnInit(){this.loadPopularContent()}loadPopularContent(){this.contentService.getPopularMovies().subscribe({next:e=>{this.popularMovies=e.results.slice(0,6),this.isLoading=!1},error:e=>{this.error="Film verileri y\xfcklenirken bir hata olu\u015ftu",this.isLoading=!1,console.error(e)}}),this.contentService.getPopularTvShows().subscribe({next:e=>{this.popularTvShows=e.results.slice(0,6),this.isLoading=!1},error:e=>{this.error="Dizi verileri y\xfcklenirken bir hata olu\u015ftu",this.isLoading=!1,console.error(e)}})}static{this.\u0275fac=function(i){return new(i||n)(t.rXU(d.f))}}static{this.\u0275cmp=t.VBU({type:n,selectors:[["app-home"]],standalone:!0,features:[t.aNF],decls:10,vars:3,consts:[["noImage",""],[1,"container"],[1,"hero-section","mb-5"],[1,"jumbotron","text-center","p-5","bg-dark","text-white","rounded"],[1,"lead"],["class","text-center my-5",4,"ngIf"],["class","alert alert-danger",4,"ngIf"],[4,"ngIf"],[1,"text-center","my-5"],["role","status",1,"spinner-border","text-primary"],[1,"visually-hidden"],[1,"alert","alert-danger"],[1,"section-title"],[1,"row"],["class","col-md-4 col-lg-2 mb-4",4,"ngFor","ngForOf"],[1,"section-title","mt-5"],[1,"row","mt-4"],[1,"col-md-6","text-center","mb-3"],["routerLink","/filmler",1,"btn","btn-outline-primary"],[1,"col-md-6","text-center"],["routerLink","/diziler",1,"btn","btn-outline-primary"],[1,"col-md-4","col-lg-2","mb-4"],[1,"card","content-card","h-100"],["class","card-img-top",3,"src","alt",4,"ngIf","ngIfElse"],[1,"card-body"],[1,"card-title"],[1,"rating","mb-2"],[1,"badge","bg-warning","text-dark"],[1,"card-text","release-date"],[1,"btn","btn-sm","btn-primary",3,"routerLink"],[1,"card-img-top",3,"src","alt"],[1,"no-image","d-flex","align-items-center","justify-content-center","bg-light"]],template:function(i,a){1&i&&(t.j41(0,"div",1)(1,"section",2)(2,"div",3)(3,"h1"),t.EFF(4,"Film ve Dizi \xd6nerileri"),t.k0s(),t.j41(5,"p",4),t.EFF(6,"En pop\xfcler film ve dizileri ke\u015ffedin, yeni favorilerinizi bulun!"),t.k0s()()(),t.DNE(7,g,4,0,"div",5)(8,u,2,1,"div",6)(9,k,16,2,"section",7),t.k0s()),2&i&&(t.R7$(7),t.Y8G("ngIf",a.isLoading),t.R7$(),t.Y8G("ngIf",a.error),t.R7$(),t.Y8G("ngIf",!a.isLoading&&!a.error))},dependencies:[s.MD,s.Sq,s.bT,s.QX,s.vh,c.Wk],styles:['.hero-section[_ngcontent-%COMP%]{margin-top:20px}.section-title[_ngcontent-%COMP%]{position:relative;margin-bottom:25px;padding-bottom:10px;font-weight:700}.section-title[_ngcontent-%COMP%]:after{content:"";position:absolute;bottom:0;left:0;width:60px;height:3px;background-color:#007bff}.content-card[_ngcontent-%COMP%]{transition:transform .3s,box-shadow .3s}.content-card[_ngcontent-%COMP%]:hover{transform:translateY(-5px);box-shadow:0 8px 16px #0000001a}.content-card[_ngcontent-%COMP%]   .card-title[_ngcontent-%COMP%]{font-size:1rem;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.content-card[_ngcontent-%COMP%]   .card-img-top[_ngcontent-%COMP%]{height:250px;object-fit:cover}.content-card[_ngcontent-%COMP%]   .no-image[_ngcontent-%COMP%]{height:250px;background-color:#e9ecef}.content-card[_ngcontent-%COMP%]   .release-date[_ngcontent-%COMP%]{font-size:.8rem;color:#6c757d}']})}}return n})()}}]);
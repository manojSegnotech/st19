import { Component, OnDestroy, OnInit, Input } from '@angular/core';
import { Validators, FormBuilder } from '@angular/forms';
import { Title, Meta } from '@angular/platform-browser';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Location } from '@angular/common';
import { MatTableDataSource } from '@angular/material/table';
import * as _ from 'lodash';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticationService } from '../../../service/authentication.service';
import { SchemaDataService } from '../../../service/schema-data.service';
import { SafePipePipe } from '../../../pipes/custom/safe-pipe.pipe';
import { ShareComponent } from '../../../shared/dialogs/default/share/share.component';
import { LoginFormComponent } from '../../../shared/dialogs/login-form/login-form.component';
import { BasicModule } from '../../../shared/modules/basic/basic.module';
import { SkeletonComponent } from "../../../shared/common/skeleton/skeleton.component";

@Component({
  selector: 'app-feeds',
  imports: [BasicModule, SkeletonComponent, SafePipePipe],
  templateUrl: './feeds.component.html',
  styleUrl: './feeds.component.scss'
})
export class FeedsComponent {
  page = 1
  loginUser: any;
  tableData: any[] | any[] = [];
  dataSource = new MatTableDataSource<any | any>(this.tableData);
  posts: any = [];
  postsData: any = {};
  postTitle: any;
  filterDictionary = new Map<any, string>();
  showReply: any = null;
  replyTo: any = null;
  currentUrl: any
  imageType: any = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'avif']
  selectedCompany: any
  connectionRequest: any[] = []
  myConnection: any[] = []
  @Input() professional: any = null
  @Input() companyFeebs: any = null
  loading = false;
  userPlusCompanies: any[] = []
  feedCompany: any;
  nextUrl = '';
  feedHash: any

  constructor(private route: ActivatedRoute, private location: Location,private meta:Meta, private router: Router, private title: Title, private dialog: MatDialog, private auth: AuthenticationService, private fb: FormBuilder, private _snackBar: MatSnackBar, private schemaDataService: SchemaDataService, private safePipe: SafePipePipe) {
    this.selectedCompany = this.auth.currentCompanyValue?.id ? this.auth.currentCompanyValue : null
    this.currentUrl = this.auth.document.location.origin
    if (location.path().includes('app/feeds/')) {
      this.title.setTitle("Feeds | Security Troops");
      this.schemaDataService.generateJsonLdScripts('blog data', 'postList')
    }
    if (location.path().includes('app/feeds/hashtag')) {
      this.route.params.pipe().subscribe(params => {
        this.feedHash = params['hash']
      });
    }
    this.meta.addTags([{ keyword: 'Bodyguard, Bouncer, Home Guard, Gunman, Watchman, Valet, Field Officer, Supervisor, Housekeeping', },
    { description: 'We provide all kind of Security Services like Bodyguard, Bouncer, Home Guard, Gunman, Watchman, Valet, Field Officer, Supervisor, Housekeeping' }]);
    this.loginUser = auth.userValue.id ? auth.userValue : null
    this.userPlusCompanies = auth.companiesList.filter(company => (company?.me?.feed == true))
    if (this.userPlusCompanies.length > 0) {
      this.userPlusCompanies.unshift(this.loginUser)
      this.feedCompany = this.loginUser
    }

  }

  ngOnDestroy(): void {
    this.title.setTitle("Security Troops");
    this.schemaDataService.removeScript()
  }

  ngOnInit(): void {
    if (!this.professional && !this.companyFeebs) {
      this.getMyConnection()
      this.getConnectionReq()
    }
    this.dataSource.filterPredicate = function (record, filter) {
      var map = new Map(JSON.parse(filter));
      let isMatch = false;
      for (let [key, value] of map) {
        isMatch = (value == "All") || (record[key as keyof any] == value);
        if (!isMatch) return false;
      }
      return isMatch;
    }
    this.blog();
  }
  selectionChange(event: any) {
    this.feedCompany = event?.value
  }
  blog(next = '') {
    let params: any = {}
    if (this.feedHash) {
      params.hashtag__title = this.feedHash
    }
    if (!next) {
      if (this.professional) {
        params.author = this.professional.id
        params.limit = 10
      }
      if (this.companyFeebs) {
        params.company = this.companyFeebs.id
        params.limit = 10
      }
    }
    this.loading = true
    let geturl = 'feeds/post/'
    if (this.companyFeebs || !this.loginUser?.id) {
      geturl = 'feeds/details/'
    }
    this.auth.getAPI(next || geturl, params, next ? true : false).subscribe({
      next: result => {
        if (this.nextUrl) {
          this.posts = [...this.posts, ...result['results']]
        }
        else {
          this.posts = result['results'];
        }
        this.dataSource.data = this.posts
        this.loading = false
        this.nextUrl = result.next
      },
      error: err => {
        this.loading = false
      }
    })
  }

  loadBlog() {
    if (this.nextUrl) {
      this.blog(this.nextUrl)
    }
  }

  getMyConnection() {
    let params: any = {}
    params.limit = 5
    params.accepted = true
    params.rejected = false
    params.block = false
    params.status = 'Active'
    this.auth.getAPI('connection/', params).subscribe(result => {
      this.myConnection = result['results'];
    })
  }
  getConnectionReq() {
    let params: any = {}
    params.limit = 5
    params.accepted = false
    params.status = 'Active'
    params.rejected = false
    params.block = false
    params.receiver = this.loginUser.id
    this.auth.getAPI('connection/', params).subscribe(result => {
      this.connectionRequest = result['results'];
    })
  }
  blogFilter(val: any) {
    this.filterDictionary.set('label', val.value);
    var jsonString = JSON.stringify(Array.from(this.filterDictionary.entries()));
    this.dataSource.filter = jsonString;
  }

  searchFilter() {
    if (this.postTitle !== '') {
      this.posts = this.posts.filter((res: { title: string; }) => {
        return res.title.toLowerCase().match(this.postTitle.toLowerCase());
      });
    } else if (this.postTitle === '') {
      this.blog();
    }
  }
  timeAlgo(value: any) {
    return this.auth.timeAlgorithm(value)
  }

  viewReply(comment: any) {
    if (comment.id == this.showReply?.id) {
      this.showReply = null
    }
    else {
      this.showReply = _.cloneDeep(comment)
    }
  }
  reply(comment: any) {
    this.replyTo = _.cloneDeep(comment)
  }

  cancelReply(feed: any) {
    this.replyTo = null
    feed.userReply = ''
  }

  postComment(comment: any = null, postdetail: any) {
    let formValue: any
    if (comment) {
      formValue = {
        'parent': comment.id,
        'post': postdetail.id,
        'user': this.loginUser.id,
        'content': postdetail.userReply
      }
    }
    else {
      formValue = {
        'parent': null,
        'post': postdetail.id,
        'user': this.loginUser.id,
        'content': postdetail.userComment
      }
    }
    this.auth.postAPI('feeds/comment/', formValue).subscribe(res => {
      if (comment) {
        this.replyTo = null
        postdetail.userReply = ''
        postdetail?.comments?.find((item: { id: any; }) => item.id == comment?.id)?.replies?.unshift(res)
      }
      else {
        postdetail.userComment = ''
        postdetail?.comments?.unshift(res)
      }

    })
  }
  likePost(postdetail: any) {
    if (postdetail.likes.includes(this.loginUser?.id)) {
      const like = postdetail?.likes.indexOf(this.loginUser?.id)
      if (like > -1) {
        postdetail?.likes.splice(like, 1);
      }
      this.auth.putAPI('feeds/likes/' + postdetail['id'] + '/', { 'likes': postdetail?.likes }).subscribe(result => {
      })
    }
    else if (this.loginUser) {
      postdetail?.likes.push(this.loginUser?.id)
      const like = postdetail?.likes
      this.auth.putAPI('feeds/likes/' + postdetail['id'] + '/', { 'likes': like }).subscribe(result => {
      })
    }
  }

  shareDialog(post: any) {
    const dialogRef = this.dialog.open(ShareComponent, {
      width: '35%',
      panelClass: 'custom-popup',
      data: {
        url: this.currentUrl + '/feed/' + post?.slug,
        title: post?.content,
        page: "Feed"
      }
    });
  }

  feedPost(item: any) {
    // let addDialog =  this.dialog.open(PostFormComponent, {
    // 	panelClass: 'custom-popup',
    // 	width: "45%",
    // 	data: {
    // 		title: item == "add" ? 'Create Feed' : "Edit Feed",
    // 		post: item,
    // 		type: 'feed',
    // 		company: this.feedCompany?.id == this.loginUser?.id ? null : this.feedCompany?.id,
    // 		professional:this.professional
    // 	}
    // });
    // addDialog.afterClosed().subscribe(responce => {
    // 	if (responce) {
    // 		let title: any
    // 		if (item == "add") {
    // 			title = "Feed Added successfully"
    // 			this.dataSource.data.unshift(responce)
    // 			this.dataSource._updateChangeSubscription()
    // 		} else {
    // 			title = "Feed Updated successfully"
    // 			item.file = responce.file
    // 			item.content = responce.content
    // 			item.title = responce.title

    // 		}
    // 		this._snackBar.open(title, '', { duration: 5000, panelClass: ['snackbar_success'] });
    // 	}
    // })
  }
  deleteDialog(data: any, index: any) {
    // const dialogRef = this.dialog.open(DeleteComponent, {
    //   panelClass: 'custom-popup',
    //   width: '35%',
    //   data: {
    //     data: data,
    //     title: 'Are you sure you want to delete this feed?',
    //     indx: 'Delete',
    //     status: 'delete'
    //   }
    // });
    // dialogRef.afterClosed().subscribe(result => {
    //   if (result?.status && result?.data) {
    //     this.auth.patchAPI(`feeds/post/${result['data']['slug']}/`, { 'status': 'Delete' }).subscribe(response => {
    //       this.dataSource.data = this.dataSource.data.filter(item => (item.id !== data.id))
    //       this.dataSource._updateChangeSubscription()
    //       this._snackBar.open(' Feed removed successfully', '', { duration: 5000, panelClass: ['snackbar_success'] });
    //     }, error => {
    //       this._snackBar.open('Error while deleting feed', '', { duration: 5000, panelClass: ['snackbar_danger'] });
    //     })
    //   }
    // })
  }
  acceptConnection(data: any = null, index: any = null, action: any = null) {
    // const dialogRef = this.dialog.open(DeleteComponent, {
    //   width: '30%',
    //   panelClass: 'custom-popup',
    //   data: {
    //     data: data,
    //     title: action ? 'Do you want to accept connection of ' + data?.['users']?.['display'] + '.' : 'Do you want to reject this connection request?'
    //   }
    // });
    // dialogRef.afterClosed().subscribe(result => {
    //   if (result && result.data) {
    //     let params: any = {}
    //     if (action) {
    //       params.accepted = true
    //       this.auth.patchAPI('connection/' + data['id'] + '/', params).subscribe(response => {
    //         this.connectionRequest = this.connectionRequest.filter(item => (item.id !== data.id))
    //         if (action) {
    //           this.myConnection.unshift(response)
    //         }
    //         this._snackBar.open(action ? 'Connection request accepted successfully.' : 'Connection request rejected successfully.', '', { duration: 5000, panelClass: ['snackbar_success'] });
    //       }, error => {
    //         this._snackBar.open(action ? '' : 'Error while processing remove request.', '', { duration: 5000, panelClass: ['snackbar_danger'] });
    //       })
    //     }
    //     else {
    //       params.rejected = true
    //       params.status = "Delete"
    //       this.auth.deleteAPI('connection/' + data['id'] + '/').subscribe(response => {
    //         this.connectionRequest = this.connectionRequest.filter(item => (item.id !== data.id))
    //         this._snackBar.open('Connection request rejected successfully.', '', { duration: 5000, panelClass: ['snackbar_success'] });
    //       }, error => {
    //         this._snackBar.open('Error while processing reject request.', '', { duration: 5000, panelClass: ['snackbar_danger'] });
    //       })
    //     }
    //   }
    // })
  }

  userChat(user: any, senders: any, channel: any) {
    if (channel) {
      this.auth.getAPI(`jabber/channel/${channel}/`).subscribe(result => {
        this.openMsg(result)
      })
    }
    else {
      let params: any = { 'content': '', 'archive': false, 'admin': false, 'individual': true }
      params.individual = true
      params.owner = user
      params.company = this.selectedCompany.id
      params.collaborators = JSON.stringify([senders, user])
      if (user != senders) {
        params.title = senders + '-' + user
      } else {
        params.title = this.loginUser.first_name
      }
      this.auth.postAPI('jabber/channel/', params).subscribe(res => {
        this.openMsg(res)
      }, error => {
        this._snackBar.open('Error while creating channel ', '', { duration: 5000, panelClass: ['snackbar_danger'] });
      })
    }
  }

  openMsg(selectedChannel: any) {
    // let msgDialog = this.dialog.open(ChatComponent, {
    //   panelClass: 'custom-popup',
    //   width: "40%",
    //   data: {
    //     channel: selectedChannel,
    //   }
    // });
    // msgDialog.afterClosed().subscribe(responce => {
    //   if (responce?.id) {
    //     this.router.navigate([`/app/messages/${responce?.id}`])
    //   }
    // })
  }
  loginForm() {
    let addDialog = this.dialog.open(LoginFormComponent, {
      panelClass: 'custom-popup',
      width: "35%",
      data: {
        title: "See more on Security Troops",
      }
    });
    addDialog.afterClosed().subscribe(responce => {
      if (responce) {
        this.loginUser = responce
      }
    })
  }
}

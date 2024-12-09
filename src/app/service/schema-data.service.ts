import { Injectable ,Inject} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthenticationService } from './authentication.service';

@Injectable({
  providedIn: 'root'
})
export class SchemaDataService {

  constructor(private http: HttpClient,private auth : AuthenticationService) { }

	generateJsonLdScripts(data:any,datatype:string): void {
    let currentURL = this.auth.document.location;
    let dataScript:any
    if(datatype == 'blogPost' || datatype == 'newsDetails'){
      dataScript = {
        "@context": "https://schema.org",
        "name": data.title,
        "@type": datatype == 'blogPost' ? "BlogPosting" : "NewsArticle",
        "headline": data.title,
        "description": data.content,
        "articleBody":data.content,
        "datePublished": data?.timestamp,
        "dateModified": data?.utimestamp,
        "url": currentURL?.origin,
        "author": {
          "@type": "Person",
          "name": data?.authors?.display,
          "image": data?.authors?.image
        },
        
        "articleSection": "Security",
        "image": {
          "@type": "ImageObject",
          "url": data?.thumbnail || data?.image,
          "width": "800",
          "height": "600"
        },
      };
      if(data?.comments){
        let comments:any[]=[]
        for (let i = 0; i < Math.min(data?.comments?.length, 5); i++) {
          const comment = data.comments[i];
          comments.push({
              "@type": "Comment",
              "author": {
                "@type": "Person",
                "name": comment?.users?.display,
                "email": this.auth.decodeSecret(comment?.users?.email),
                "image": comment?.users?.image
              },
              "datePublished": comment?.timestamp,
              "text": comment?.content,
              "replyToUrl": currentURL?.href
          })
          
        }
        dataScript.comment = comments
      }
    }

    else if(datatype == 'newsList' || datatype == 'postList'){
      dataScript ={
        "@context": "https://schema.org",
        "@type": "ItemList",
        "url": currentURL.origin,
      }
      let itemListElement:any[]=[]
      for (let i = 0; i < Math.min(data.length, 5); i++) {
        itemListElement.push({
            "@type": "ListItem",
            "position": i+1,
            "item": {
              "@type": datatype == "postList" ? "Blog" : "NewsArticle",
              "name": data[i].title,
              "headline": data[i].title,
              "datePublished": data[i]?.timestamp,
              "dateModified": data[i]?.utimestamp,
              "url": `${currentURL?.origin}/${data[i].slug}`,
              "author": {
                "@type": "Person",
                "name": data[i]?.authors?.display || "Security troops",
                "image": data[i]?.authors?.image || currentURL?.origin+'/assets/images/login/st.png'
              },
              "publisher": {
                "@type": "Organization",
                "name": 'Security Troops',
                "logo": {
                  "@type": "ImageObject",
                  "url": currentURL?.origin+'/assets/images/login/st.png'
                }
              },
              "image":  data[i]?.thumbnail || data[i]?.image,
              "description": data[i].content,
            }
          })
      }
      dataScript.itemListElement = itemListElement
    }
    else if(datatype == 'companiesList'){
      dataScript ={
        "@context": "https://schema.org",
        "@type": "ItemList",
        "url": currentURL.origin,
      }
      let itemListElement:any[]=[]
      for (let i = 0; i < Math.min(data.length, 5); i++) {
        const company = data[i];
        itemListElement.push({
          "@type": "ListItem",
          "position": 1+i,
          "url": currentURL.origin,
          "datePublished": company?.timestamp,
          "author": {
            "@type": "Person",
            "name": company?.owners?.display
          },
          "publisher":{
            "@type": "Organization",
            "name": company?.name,
            "logo": {
              "@type": "ImageObject",
              "url": company?.logo?company.logo:currentURL?.origin+'/assets/images/login/st.png'
            }
          }
        })
      }
      dataScript.itemListElement = itemListElement
    }
    else if(datatype == 'company'){
      dataScript={
        "@context": "https://schema.org",
        "@type": "Organization",
        "name": data?.name,
        "url": currentURL?.href,
        "logo": data?.logo,
        "description": data?.about,
        "contactPoint": {
          "@type": "ContactPoint",
          "telephone": this.auth.decodeSecret(data?.phone),
          "contactType": "customer service"
        },
        "address": {
          "@type": "PostalAddress",
          "streetAddress": data?.address,
          "addressLocality": "Anytown",
          "addressRegion": "CA",
          "postalCode": data?.postcode,
          "addressCountry": data?.countries?.name
        },
        "mainEntityOfPage":{
          "@type": "WebPage",
          "@id": data?.website,
          "publisher": {
            "@type": "Organization",
            "name": data?.name,
            "logo": {
              "@type": "ImageObject",
              "url": data?.logo,
            }
          },
        }
      }
      
    }
    else if(datatype == 'serviceList'){
      dataScript={
        "@context": "https://schema.org",
        "@type": "ItemList"
      }
      let itemListElement:any[]=[]
      for (let i = 0; i < Math.min(data.length, 5); i++) {
        const service = data[i];
        itemListElement.push({
          "@type": "Service",
          "name": service?.title,
          "description": service?.content,
          "keywords": service?.keyword,
          "image": service?.thumbnail ? service.thumbnail : service?.cover,
          "url": currentURL?.href,
          "provider": {
            "@type": "Organization",
            "name": "Security troops"
          }
        })
      }
      dataScript.itemListElement = itemListElement
    }

    else if(datatype == 'service'){
      dataScript={
        "@context": "http://schema.org",
        "@type": "Service",
        "name": data?.title,
        "url": currentURL?.href,
        "description": data?.content,
        "provider": {
          "@type": "Organization",
          "name": "Security troops",
          // "url": "https://www.example.com",
          "logo": currentURL?.origin+'/assets/images/login/st.png'
        }
      }
      
    }
    else if(datatype == 'jobsList'){
      dataScript={
        "@context": "http://schema.org",
        "@type": "ItemList",
        "name": "Job Opportunities",
        "url": "https://www.example.com/jobs",
        "description": "Browse our available job opportunities",
      }
      let itemListElement:any[]=[]
      for (let i = 0; i < Math.min(data.length, 5); i++) {
        const job = data[i];
        itemListElement.push({
          "@type": "JobPosting",
          "title": job.title,
          "url": currentURL?.href+'/'+job?.slug,
          "description": job?.responsibility,
          "datePosted": job?.timestamp,
        })
      }
      dataScript.itemListElement = itemListElement
      
    }
    else if(datatype == 'job'){
      dataScript={
        "@type": "JobPosting",
        "title": data.title,
        "url": currentURL?.href,
        "description": data?.responsibility,
        "datePosted": data?.timestamp,
      }
      
    }
    else if(datatype == 'professionalList'){
      dataScript={
        "@context": "https://schema.org",
        "@type": "ItemList",
        "name": "Professional User List",
        "description": "List of professional users",
      }
      let itemListElement:any[]=[]
      for (let i = 0; i < Math.min(data.length, 5); i++) {
        const professional = data[i];
        itemListElement.push({
          "@type": "ListItem",
          "position": 1+i,
          "item": {
            "@type": "Person",
            "name": professional?.display,
            "url": currentURL?.href+'/'+professional?.username,
            "image": professional?.image,
            "jobTitle": professional?.services?.title,
            "worksFor": {
              "@type": "Organization",
              "name": "Security Troops"
            },
            "sameAs": [
              professional?.facebook,
              professional?.instagram,
              professional?.twitter
            ]
          }
          }
        )
      }
      dataScript.itemListElement = itemListElement
    }
    else if(datatype == 'professional'){
      dataScript={
        "@context": "https://schema.org",
        "@type": "Person",
        "name": data.display,
        "url": currentURL?.href,
        "image": data?.image,
        "jobTitle": data?.services?.title,
        "sameAs": [
          data?.facebook,
          data?.instagram,
          data?.twitter
        ],
        "email": this.auth.decodeSecret(data?.email),
        "telephone": this.auth.decodeSecret(data?.mobile),
      }
    }
    else if (datatype == 'plans'){
      dataScript={
        "@context": "https://schema.org",
        "@type": "OfferCatalog",
        "name": "Subscription Plans",
        "description": "List of subscription plans with pricing and features",
      }
      let itemListElement:any[]=[]
      let additionalProperty:any[]=[]
      for (let plan of data) {
        additionalProperty=[]
        for(let feature of plan?.features){
          additionalProperty.push(
              feature?.title
           )
        }
        itemListElement.push( {
            "@type": "Offer",
            "name": plan?.title,
            "description": `${plan?.title} monthly subscription plan with essential features.`,
            "priceCurrency": "INR",
            "price": plan?.monthly!="-"?plan?.monthly:0,
            "url": currentURL?.href,
            "itemCondition": "http://schema.org/NewCondition",
            "availability": "http://schema.org/InStock",
            "includesObject": {
              "@type": "Service",
              "name": `${plan?.title} Feature List`,
              "serviceType": `${plan?.title} Features`,
              "featureList": additionalProperty
            },
        })
      }
      dataScript.itemListElement = itemListElement
    }

    if (!(datatype == 'company' || datatype == 'service' || datatype == 'jobsList')){
      dataScript.mainEntityOfPage={
        "@type": "WebPage",
        "@id": currentURL?.href,
        "publisher":{
          "@type": "Organization",
          "name": 'Security Troops',
          "logo": {
            "@type": "ImageObject",
            "url": currentURL?.origin+'/assets/images/login/st.png'
          },
          "address": {
            "@type": "PostalAddress",
            "streetAddress": "D-21,Mahalaxmi Nagar Road,D-Block,Malviya Nagar,Jaipur,Rajasthan,302017",
            "addressLocality": "Jaipur",
            "addressRegion": "Rajasthan",
            "postalCode": "302017",
            "addressCountry": "India"
          },
          "contactPoint": {
            "@type": "ContactPoint",
            "telephone": "+91 - 8003806777",
            "contactType": "customer service",
            "email": "info@securitytroops.com"
          }
        }
      }
    }
    
    this.addScript(dataScript)
	}
  removeScript(){
    const existingScript = this.auth.document.querySelector('script[type="application/ld+json"]');
    if (existingScript) {
        existingScript?.parentNode?.removeChild(existingScript);
    }
  }

  addScript(dataScript:any){
    this.removeScript()
    const scriptElement = this.auth.document.createElement('script');
		scriptElement.type = 'application/ld+json';
		scriptElement.text = JSON.stringify(dataScript);
		this.auth.document.head.appendChild(scriptElement);
  }
}
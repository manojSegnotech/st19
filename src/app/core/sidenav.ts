import { constant } from "lodash"

export const All: any = ['Owner', 'Admin', 'Manager', 'Representative','Employee','Client','User','Patrolling']
export const Admin: any = ['Owner', 'Admin']
export const Owner: any = ['Owner']
export const Manager: any = ['Owner', 'Admin', 'Manager']
export const Client: any = ['Owner', 'Admin','Client']
export const ClientManager: any = ['Owner', 'Admin','Client','Manager']
export const Patrolling: any = ['Owner', 'Admin','Client','Manager','Patrolling','Employee']
export const Member: any = ['Owner', 'Admin', 'Manager', 'Representative','Employee','Client','Patrolling']
export const Employee: any = ['Owner', 'Admin', 'Manager','Employee','Patrolling']
export const NoOwner: any = ['Admin', 'Manager', 'Representative','Employee','Patrolling']
export const Worker: any = ['Employee','Client','Patrolling']
export const Reseller: any = ['Reseller']


export const Headings: any = {
    hr_management:[
         {
            name: 'HR Management',
            icon: 'manage_accounts',
            path: 'app/hr',
            role: Employee,
            subheadings: [
                {
                    name: 'Team',
                    icon: 'groups',
                    path: '/app/hr/team',
                    role: Employee,
                    type:'Team',
                },
                {
                    name: 'Client',
                    icon: 'portrait',
                    path: '/app/hr/client',
                    role: Manager,
                    type:'Client',
                },
                {
                    name: 'Invite',
                    icon: 'group_add',
                    path: '/app/hr/invite',
                    role: Manager,
                    type:'Invite-list',
                },
                {
                    name: 'Attendance',
                    icon: 'person_check',
                    path: '/app/hr/attendance',
                    role: All,
                    type:'Attendance',
                },
                {
                    name: 'Leave',
                    icon: 'directions_walk',
                    path: '/app/hr/leave',
                    role: Employee,
                    type:'Leave',
                },
                {
                    name: 'Holiday',
                    icon: 'event',
                    path: '/app/hr/holiday',
                    role: Manager,
                    type:'Holiday',
                },
                {
                    name: 'Document',
                    icon: 'description',
                    path: '/app/hr/document',
                    role: Manager,
                    type:'Document-list',
                },
                {
                    name: 'Transfer',
                    icon: 'transfer_within_a_station',
                    path: '/app/hr/transfer',
                    role: Manager,
                    type:'Transfer',
                    details:'/app/agency/work/',
                },
                {
                    name: 'Uniform',
                    icon: 'styler',
                    path: '/app/hr/uniform',
                    role: Manager,
                    type:'Uniform',
                },
                {
                    name: 'Enquiry',
                    icon: 'psychology_alt',
                    path: '/app/hr/enquiry',
                    role: Manager,
                    type:'Enquiry',
                },
                {
                    name: 'Employee IDs',
                    icon: 'portrait',
                    path: '/app/hr/id-cards',
                    role: Manager,
                },
                {
                    name: 'My Salary',
                    icon: 'currency_rupee',
                    path: '/app/hr/salary',
                    role: ['Employee','Manager','Patrolling'],
                },
                {
                    name: 'Resignations',
                    icon: 'transfer_within_a_station',
                    path: '/app/hr/resignations',
                    role: Admin,
                },
                {
                    name: 'Resign',
                    icon: 'group_remove',
                    path: '/app/hr/resign',
                    role: NoOwner,
                },
               
            ]
        }
    ],
    bussiness: [
        {
            name: 'Agency',
            icon: 'business',
            path: 'app/agency',
            role: All,
            subheadings: [
                {
                    name: 'Agency',
                    icon: 'business',
                    path: '/app/agency/company',
                    role: All,
                },
                {
                    name: 'Work/Site/Point',
                    type:'Work',
                    icon: 'work',
                    path: '/app/agency/work',
                    details:'/app/agency/work/',
                    role: All,
                },

                {
                    name: 'Shift',
                    type:'Shift',
                    icon: 'schedule',
                    path: '/app/agency/shift',
                    role: Admin,

                },

                {
                    name: 'Daily Alert',
                    type:'Alert',
                    icon: 'warning',
                    path: '/app/agency/alert',
                    role: ClientManager,

                },
                {
                    name: 'Alert Reply',
                    type:'AlertReply',
                    icon: 'reply',
                    path: '/app/agency/alert-reply',
                    role: ClientManager,

                },
               
                {
                    name: 'Bid/Auction',
                    icon: 'gavel',
                    path: '/app/agency/work-request',
                    role: Manager,
                },
                
                
                {
                    name: 'Poll',
                    icon: 'poll',
                    path: '/app/agency/poll',
                    role: Member,
                    type:'Poll',
                },
                {
                    name: 'Measurement',
                    icon: 'fitness_center',
                    path: '/app/agency/measurement',
                    role: Employee,
                    type:'Measurement',
                },
                
                {
                    name: 'Gallery',
                    icon: 'collections_bookmark',
                    path: '/app/agency/gallery',
                    role: All,
                    type:'Gallery',
                },
                
                {
                    name: 'Office',
                    icon: 'apartment',
                    path: '/app/agency/office',
                    role: Member,
                    type:'Office',
                },
                
                {
                    name: 'Complaint',
                    icon: 'support_agent',
                    path: '/app/agency/complain',
                    role: Client,
                    type:'Complaint',
                    details:'/app/agency/work/',
                },
                // {
                //     name: 'Company Faq',
                //     icon: 'quiz',
                //     path: '/app/agency/company-faq',
                //     role: All,
                //     type:'CompanyFaq',
                // },
                {
                    name: 'Portfolio',
                    icon: 'badge',
                    path: '/app/agency/portfolio',
                    role: Admin,
                    type:'Portfolio',
                },
                {
                    name: 'Live track',
                    icon: 'location_on',
                    path: '/app/agency/live-track',
                    role: Manager,
                    type:'LiveTrack',
                },
              
            ]
        }
    ],
    inventory: [
        {
            name: 'Inventory',
            icon: 'inventory',
            path: 'app/inventory',
            role: Manager,
            subheadings: [
                {
                    name: 'Category',
                    type: 'Category',
                    icon: 'view_quilt',
                    path: '/app/inventory/category',
                    role: Manager,
                    
                },
                // {
                //     name: 'Tax',
                //     icon: 'receipt',
                //     path: '/app/inventory/tax',
                //     role: Manager,
                //     type:'Tax',
                // },
                {
                    name: 'Products',
                    icon: 'all_inbox',
                    path: '/app/inventory/products',
                    role: Manager,
                    type:'Products',
                },
                {
                    name: 'Purchase',
                    icon: 'add_shopping_cart',
                    path: '/app/inventory/purchase',
                    role: Manager,
                    type:'OutwardStock',
                },
                {
                    name: 'Sales',
                    icon: 'sell',
                    path: '/app/inventory/sale',
                    role: Manager,
                    type:'InwardStock',
                },
                {
                    name: 'Report',
                    icon: 'trending_up',
                    path: '/app/inventory/report',
                    role: Manager,
                    type:'Report',
                },
            ]
        }
    ],
    patrolling: [
        {
            name: 'Patrolling',
            icon: 'minor_crash',
            path: 'app/patrolling',
            role: Patrolling,
            subheadings: [
                {
                    name: 'Place',
                    type: 'Place',
                    icon: 'storefront',
                    path: '/app/patrolling/place',
                    role: Patrolling,
                },
                {
                    name: 'Scans',
                    type: 'Scan',
                    icon: 'qr_code_scanner',
                    path: '/app/patrolling/scan',
                    role: Patrolling,
                },
                {
                    name: 'Live Team',
                    type: 'LiveTrack',
                    icon: 'groups',
                    path: '/app/patrolling/team',
                    role: Patrolling,
                },
                {
                    name: 'Payment',
                    type: 'PatrollingPay',
                    icon: 'currency_rupee',
                    path: '/app/patrolling/payment',
                    role: Patrolling,
                },
            ]
        }
    ],
    job: [
        {
            name: 'Jobs',
            icon: 'work',
            path: 'app/job',
            role: Employee,
            subheadings: [
                {
                    name: 'All Jobs',
                    icon: 'view_quilt',
                    path: '/app/job/jobs',
                    role: Manager,
                    type:'Job',
                    details:'/app/job/detail/',
                },
                {
                    name: 'Applications',
                    icon: 'inbox',
                    path: '/app/job/applications',
                    role: Manager   ,
                    type:'Application',
                },
                {
                    name: 'My Applications',
                    icon: 'inbox',
                    path: '/app/job/my-applications',
                    role: Employee   ,
                    type:'My_Application',
                },
            ]
        }
    ],
    society: [
        {
            name: 'Society',
            icon: 'location_city',
            path: 'app/society',
            role: Employee,
            subheadings: [
                {
                    name: 'Societies',
                    icon: 'location_city',
                    path: '/app/society/list',
                    role: Employee,
                    type:'Society',
                },
                {
                    name: 'Apartment',
                    icon: 'apartment',
                    path: '/app/society/apartment',
                    role: Employee,
                    type:'Apartment',
                },
                {
                    name: 'Employee',
                    icon: 'person_apron',
                    path: '/app/society/employee',
                    role: Owner,
                    type:'Employee',
                },
                {
                    name: 'Amenity',
                    icon: 'build',
                    path: '/app/society/amenity',
                    role: Employee,
                    type:'Amenity',
                },
                {
                    name: 'Vehicle',
                    icon: 'directions_car',
                    path: '/app/society/vehicle',
                    role: Employee,
                    type:'Vehicle',
                },
                {
                    name: 'Maintenance',
                    icon: 'engineering',
                    path: '/app/society/maintenance',
                    role: Employee,
                    type:'Maintenance',
                },
                {
                    name: 'Delivery',
                    icon: 'local_shipping',
                    path: '/app/society/delivery',
                    role: Employee,
                    type:'Delivery',
                },
                {
                    name: 'Event',
                    icon: 'event',
                    path: '/app/society/event',
                    role: Employee,
                    type:'Event',
                },
                {
                    name: 'Panic',
                    icon: 'emergency_home',
                    path: '/app/society/panic',
                    role: Employee,
                    type:'Panic',
                },
                {
                    name: 'Complaint',
                    icon: 'support_agent',
                    path: '/app/society/complain',
                    role: Employee,
                    type:'SocietyComplaint',
                },
                {
                    name: 'Poll',
                    icon: 'poll',
                    path: '/app/society/poll',
                    role: Employee,
                    type:'SocietyPoll',
                },
                {
                    name: 'Visitor',
                    icon: 'person_apron',
                    path: '/app/society/visitor',
                    role: Employee,
                    type:'Visitor',
                },
            ]
        }
    ],
    accounting: [
        {
            name: 'Accounting',
            icon: 'account_balance',
            path: 'app/accounting',
            role: Client,
            subheadings: [
                {
                    name: 'Invoice',
                    icon: 'receipt_long',
                    path: '/app/accounting/invoice',
                    role: Client,
                    type:'Invoice',
                },
                {
                    name: 'Payment Method',
                    icon: 'payment',
                    path: '/app/accounting/payment',
                    role: Admin,
                    type:'PaymentMethod',
                },
                {
                    name: 'Salary',
                    icon: 'currency_rupee',
                    path: '/app/accounting/salary',
                    role: Admin,
                    type:'Salary',
                },
                {
                    name: 'Advance Payment',
                    icon: 'currency_rupee',
                    path: '/app/accounting/advance-payment',
                    role: Admin,
                    type:'Salary',
                },
                // {
                //     name: 'Salary Slip',
                //     icon: 'currency_rupee',
                //     path: '/app/accounting/salary-slip',
                //     role: Admin,
                //     type:'Salary',
                // },
                {
                    name: 'PF',
                    icon: 'bar_chart',
                    path: '/app/accounting/pf',
                    role: Admin,
                    type:'Salary',
                },
                {
                    name: 'ESI',
                    icon: 'bar_chart',
                    path: '/app/accounting/esi',
                    role: Admin,
                    type:'Salary',
                },
                {
                    name: 'Report',
                    icon: 'bar_chart',
                    path: '/app/accounting/report',
                    role: Admin,
                    type:'Report',
                },
                {
                    name: 'Plans',
                    icon: 'checklist',
                    path: '/app/accounting/plans',
                    role: Admin,
                    type:'Plans',
                },
                {
                    name: 'Receipts',
                    icon: 'receipt',
                    path: '/app/accounting/payment-receipt',
                    role: Client,
                    type:'Receipt',
                },
            ]
        }
    ],
    message: [
        {
            name: 'Message',
            icon: 'chat',
            type:'Chat',
            path: '/app/messages',
            role: All,
            details:'/app/messages/',
            subheadings: []
        }
    ],
    reseller:[
        {
            name: 'Reseller',
            icon: 'hub',
            path: '/app/reseller',
            profession: Reseller,
            subheadings:[
                {
                    name: 'Contract',
                    icon: 'receipt_long',
                    path: '/app/reseller/contract',
                    profession: Reseller,
                    type:'Contract',
                },
                {
                    name: 'Sales',
                    icon: 'sell',
                    path: '/app/reseller/sales',
                    profession: Reseller,
                    type:'Resell',
                },
                {
                    name: 'Withdraw',
                    icon: 'arrow_circle_down',
                    path: '/app/reseller/withdraw',
                    profession: Reseller,
                    type:'Withdraw',
                },
            ]
        }
    ],
    channel: [
        {
            name: 'Message',
            icon: 'chat',
            type:'Channel',
            path: '/app/messages',
            role: Employee,
            details:'/app/messages/',
            subheadings: []
        }
    ],
    id: [
        {
            name: 'My ID Card',
            icon: 'person_book',
            path: '/app/id-card',
            role: Employee,
            subheadings: []
        }
    ],
    lead: [
        {
            name: 'Marketing',
            icon: 'linked_services',
            path: '/app/marketing',
            role: Employee,
            subheadings: [
                {
                    name: 'Lead',
                    icon: 'leaderboard',
                    path: '/app/marketing/lead',
                    profession: Employee,
                    type:'Lead',
                },
                {
                    name: 'Followup',
                    icon: 'connect_without_contact',
                    path: '/app/marketing/followup',
                    profession: Employee,
                    type:'Followup',
                },
                {
                    name: 'Reminder',
                    icon: 'event',
                    path: '/app/marketing/reminder',
                    profession: Employee,
                    type:'Followup',
                },
            ]
        }
    ],
    mapTracking: [
        {
            name: 'Map Tracking',
            icon: 'map',
            path: '/app/map-tracking',
            role: Manager,
            subheadings: []
        }
    ],
    refer: [
        {
            name: 'Refer & Earn',
            icon: 'account_balance_wallet',
            path: '/app/refer-and-earn',
            role: Member,
            subheadings: []
        }
    ],
    feed: [
        {
            name: 'Feeds',
            type:'Feed',
            icon: 'dynamic_feed',
            path: '/app/feeds',
            role: All,
            details:'/app/feeds/',
            subheadings: []
        }
    ],
    blog: [
        {
            name: 'Blogs',
            type: 'Post',
            icon: 'rss_feed',
            path: '/blog',
            role: All,
            details:'/blog/',
            subheadings: []
        }
    ],
    invite: [
        {
            name: 'Invite',
            icon: 'group_add',
            path: '/app',
            role: Manager,
            type:'Invite',
            subheadings: []
        },
    ],
    professional: [
        {
            name: 'Professional',
            type: 'Connection',
            icon: 'rss_feed',
            path: '/professional',
            role: All,
            details:'/professional/',
            subheadings: []
        }
    ],
   
    document: [
        {
            name: 'Document',
            icon: 'description',
            path: '/app/profile',
            role: All,
            type:'Document',
            subheadings: []
        },
    ],
   
    workTeam: [
        {
            name: 'Work/Site/Point Team',
            icon: 'team',
            path: '/app/agency/work',
            role: Member,
            type:'WorkTeam',
            details:'/app/agency/work/',
            subheadings: []
        },
    ],
    Panic:[{
        name: 'Panic Alert',
        icon: 'emergency_home',
        path: '/app/panic-alert',
        role: All,
        type:'Panic',
        subheadings: []
    }],
   
}


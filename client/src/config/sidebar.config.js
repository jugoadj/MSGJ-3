


import { Photo, StarOutline, SendOutlined, InsertDriveFileOutlined, DeleteOutlined,
    MailOutlined } from '@mui/icons-material';

export const SIDEBAR_DATA = [
    {
        name: 'inbox',
        title: 'Inbox',
        icon: Photo,
        path: '/inbox',
    },
    {
        name: 'starred',
        title: 'Starred',
        icon: StarOutline,
        path: '/starred',
    },
    {
        name: 'sent',
        title: 'Sent',
        icon: SendOutlined,
        path: '/sent',
    },
    {
        name: 'drafts',
        title: 'Drafts',
        icon: InsertDriveFileOutlined,
        path: '/drafts',
    },
    {
        name: 'bin',
        title: 'Bin',
        icon: DeleteOutlined,
        path: '/bin',
    },
    {
        name: 'allmail',
        title: 'All Mail',
        icon: MailOutlined,
        path: '/allmails',
    }
];
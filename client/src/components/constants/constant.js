export const gmailLogo = require('./logo.png');
export const emptyInbox = 'https://miro.medium.com/max/1088/1*DhOnyEHovQZ31rH00-VUDw.png';
export const emptyProfilePic = 'https://ssl.gstatic.com/ui/v1/icons/mail/profile_mask2.png';

export const VIEWS = {
    inbox: 'inbox',
    starred: 'starred',
    sent: 'sent',
    drafts: 'drafts'
}

export const EMPTY_TABS = {
    "api/email/inbox": {
        heading: 'Your inbox is empty',
        subHeading: "Mails that don't appear in other tabs will be shown here."
    },
    "api/email/drafts": {
        heading: "You don't have any saved drafts.",
        subHeading: "Saving a draft allows you to keep a message you aren't ready to send yet."
    },
    "api/email/starreddisplay": {
        heading: 'No starred messages',
        subHeading: "Stars let you give messages a special status to make them easier to find."
    },
    "api/email/sentemails": {
        heading: 'No sent messages!',
        subHeading: 'Send one now!'
    },
    "api/email/all": {
        heading: 'No conversations in Bin.',
        subHeading: ''
    },
    "api/email/bindisplay": {
        heading: 'No conversations in Bin.',
        subHeading: ''
    }
}
import { faHouse, faBomb, faLocationDot, faComment, faUserGroup, faList, faBell, faUser, faBars, type IconDefinition } from '@fortawesome/free-solid-svg-icons';


interface Item {
    icon: IconDefinition;
    label: string;
    path: string;
}

export const menuItems: Item[] = [
    { icon: faHouse, label: 'home', path: '#/' },
    { icon: faBomb, label: 'feed', path: '#/feed' },
    { icon: faLocationDot, label: 'near me', path: '#/near-me' },
    { icon: faComment, label: 'chats', path: '#/chats' },
    { icon: faUserGroup, label: 'friends', path: '#/friends' },
    { icon: faList, label: 'categories', path: '#/categories' },
    { icon: faBell, label: 'requests', path: '#/requests' }
];
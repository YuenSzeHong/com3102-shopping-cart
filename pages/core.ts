export interface Item {
    id: string;
    title: string;
    description: string;
    price: number;
}

export function getAllItems(): readonly Item[] {
    return shopItems;
}

const shopItems = [
    {
        id: '101',
        title: 'PS5 Router',
        description: 'A good router',
        price: 3499
    },
    {
        id: '307',
        title: 'Hello Melody',
        description: 'A lovely doll',
        price: 199
    },
    {
        id: '299',
        title: 'Acelook',
        description: 'The next-generation product',
        price: 150
    },
    {
        id: '2991',
        title: 'Gitch 1',
        description: 'No idea',
        price: 3333
    },
    {
        id: '2992',
        title: 'Gitch 2',
        description: 'No idea',
        price: 4444
    },
    {
        id: '2993',
        title: 'Gitch 3',
        description: 'No idea',
        price: 111
    },
    {
        id: '2994',
        title: 'Gitch 4',
        description: 'No idea',
        price: 222
    },
    {
        id: '2995',
        title: 'Gitch 5',
        description: 'No idea',
        price: 100
    },
    {
        id: '2996',
        title: 'Gitch 6',
        description: 'No idea',
        price: 22200
    },
    {
        id: '2997',
        title: 'Gitch 7',
        description: 'No idea',
        price: 1
    },
    {
        id: '2998',
        title: 'Gitch 8',
        description: 'No idea',
        price: 345
    }
] as const;
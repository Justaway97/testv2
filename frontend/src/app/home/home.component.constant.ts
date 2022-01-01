export const itemListHeader: string[] = [
    'item_name',
    'quantity',
    'warehouse',
];

export const orderListHeader: string[] = [
    'order_id',
    'item_name',
    'quantity',
    'order_date',
    'order_by',
    'target_received_date',
    'delay_day',
    'outlet_id',
    'arrived_date',
    'order_received',
    'order_completed',
    'remark',
];

export const editableOrderList: any[] = [
    {
        name: 'order_id',
        type: 'none',
    },
    {
        name: 'item_name',
        type: 'none',
    },
    {
        name: 'quantity',
        type: 'integer',
    },
    {
        name: 'order_date',
        type: 'none',
    },
    {
        name: 'target_received_date',
        type: 'date',
    },
    {
        name: 'delay_day',
        type: 'none',
    },
    {
        name: 'outlet_id',
        type: 'none',
    },
    {
        name: 'arrived_date',
        type: 'none',
    },
    {
        name: 'order_received',
        type: 'none',
    },
    {
        name: 'order_completed',
        type: 'none',
    },
    {
        name: 'remark',
        type: 'none',
    },
];

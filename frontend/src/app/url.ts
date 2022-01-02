export abstract class Url {
    public static getWarehouseURL(): string {
        return 'warehouse';
    }
    public static getLoginURL(): string {
        return 'login';
    }
    public static getItemURL(): string {
        return 'item';
    }
    public static getHomeURL(): string {
        return 'home';
    }
    public static getOrderURL(): string {
        return 'order';
    }
    public static getRegisterURL(): string {
        return 'register';
    }
    public static getOutletURL(): string {
        return 'outlet';
    }
    public static getApprovalURL(): string {
        return 'approval/user';
    }
    public static getUserApprovalURL(): string {
        return 'userapproval';
    }
    public static getOrderWarehouseURL(): string {
        return 'order/warehouse';
    }
}
type itemStatus = "open" | "remediated" | "unknown";
type itemSource = "landlord" | "inspector" | "government" | "tenant_report" | "system_import" | "other";
type itemCategory = "repair" | "replacement" | "mitigation";
type itemIssue = "molds" | "pests" | "water_drainage" | "other";

export type createPropertyItemDetailsType = {
    propertyId: string;
    itemName: string;
    itemDescription: string;
    itemPrice: number;
    itemQuantity: number;
    itemTotal: number;
    itemStatus: itemStatus;
    itemSource: itemSource;
    itemCategory: itemCategory;
    itemIssue: itemIssue;
}
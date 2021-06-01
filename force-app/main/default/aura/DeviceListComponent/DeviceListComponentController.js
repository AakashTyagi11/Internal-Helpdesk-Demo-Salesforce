({
    handleFetchDevices : function(component, event, helper) {
        helper.handleFetchDevicesHelper(component, event, helper);
    },
    handleUpdateSorting : function(component, event, helper) {
        helper.handleUpdateSortingHelper(component, event, helper);
    },
    handleConfirmDialog : function(component, event, helper) {
        component.set('v.showConfirmDialog', true);
        component.set('v.toDelete', event.getParam('row').Id);
    },
     
    handleConfirmDialogYes : function(component, event, helper) {
        helper.handleDeleteRecordHelper(component, event, helper);
    },
     
    handleConfirmDialogNo : function(component, event, helper) {
        component.set('v.showConfirmDialog', false);
    },
    handleCreateRecords : function(component, event, helper) {
        helper.handleCreateRecordsHelper(component, event, helper);
    },
})

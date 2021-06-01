({ 
     //Fetches laptops and desktops corresponding to an employee.
    handleFetchDevicesHelper : function(component, event, helper) {
        component.set('v.mycolumns', [
            {label: 'Device Name', fieldName: 'linkName', type: 'url', sortable : true,
                typeAttributes: {label: { fieldName: 'Name' }, target: '_blank'}},
            {label: 'Device ID', fieldName: 'Device_ID__c', type: 'Auto number', sortable : true},
            {label: 'Type', fieldName: 'Type__c', type: 'text', sortable : true},
            {type: "button", typeAttributes: {
                label: 'Delete',
                name: 'Delete',
                title: 'Delete',
                disabled: false,
                value: 'Delete',
                iconPosition: 'left',
                variant: 'destructive'
            }}
        ]);
        var action = component.get("c.fetchDesktopsAndLaptops");

        action.setParams({
            recordId: component.get("v.recordId")
        });

        action.setCallback(this, function(response){
            var state = response.getState();
            if (state === "SUCCESS") {
                var records = response.getReturnValue();
                if($A.util.isEmpty(records)){
                    component.set("v.empty", true);
                }
                records.forEach(function(record){
                record.linkName = '/' + record.Id;
            });
                component.set("v.deviceList", records);
            }
        });
        $A.enqueueAction(action);
    },

    //Deletes requested device. 
    handleDeleteRecordHelper : function(component, event, helper) {
        var recId = component.get("v.toDelete");       
            var title = '';
            var type = '';
            var message = 'Error';
            var action = component.get("c.deleteDevices");

            action.setParams({
                "recordId": recId
            });
    
            action.setCallback(this, function(response){
                var state = response.getState();
                if (state === "SUCCESS") {
                    title = 'Success';
                    type = 'success';
                    message = 'Device is deleted Successfully';
                }
                else if (state === "ERROR") {
                    var errors = response.getError();
                    if (errors) {
                        if (errors[0] && errors[0].message) {
                            console.log(errors[0].message);
                            title = 'Error';
                            type = 'error';
                            message = errors[0].message;
                        }
                    }         
                }
                component.set('v.showConfirmDialog', false);
                var toastEvent = $A.get("e.force:showToast");
                toastEvent.setParams({
                     "title": title,
                     "type": type,
                     "message": message
                });
                this.handleFetchDevicesHelper(component, event, helper);
                toastEvent.fire();
            });        
        $A.enqueueAction(action);
    },

    //Auto-populate employee and create new device. 
    handleCreateRecordsHelper: function (component, event, helper) {
        var createRecordEvent = $A.get("e.force:createRecord");
        createRecordEvent.setParams({
        "entityApiName": "Device__c",
        "defaultFieldValues": {
            'AssignedTo__c' : component.get("v.recordId")
        }
         });
         createRecordEvent.fire();
    },

    //Sort data by field. 
    handleUpdateSortingHelper: function (component, event, helper) {
        var fieldName = event.getParam('fieldName');
        var sortDirection = event.getParam('sortDirection');
        component.set("v.sortedBy", fieldName);
        component.set("v.sortedDirection", sortDirection);
        var data = component.get("v.deviceList");
        var reverse = sortDirection !== 'asc';
        data.sort(this.sortBy(fieldName, reverse))
        component.set("v.deviceList", data);
    },

    //determine the sort type.
    sortBy: function (field, reverse) {
        var key = function(x) {return x[field]};
        reverse = !reverse ? 1 : -1;
        return function (a, b) {
            return a = key(a), b = key(b), reverse * ((a > b) - (b > a));
        }
    }

})


trigger DeviceUpdateTrigger on Device__c (before update, before delete) {

    if(Trigger.isBefore){
        if(Trigger.isUpdate ){
            DeviceTriggerHandler.handleDeviceUpdate(Trigger.old, Trigger.newMap);
        }
        else if(Trigger.isDelete){
            DeviceTriggerHandler.handleDeviceDeletion(Trigger.old);
        }
    }

}
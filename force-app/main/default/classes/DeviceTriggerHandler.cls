public with sharing class DeviceTriggerHandler {
    
    /** 
     * Bulify trigger.
     * @handleDeviceUpdate avoid re-assigning the only employee laptop.
     * @handleDeviceDeletion avoid the deletion of the only employee laptop.
    */
   
    public static void handleDeviceUpdate(List<Device__c> devices, Map<ID, Device__c> newDevices){

        Set<Id> employeeIds = new Set<Id>();

        for(Device__c device : devices){
            if( device.Type__c == 'Laptop' && ((device.AssignedTo__c != newDevices.get(device.ID).AssignedTo__c) || (newDevices.get(device.ID).Type__c != 'Laptop'))){
                employeeIds.add(device.AssignedTo__c);
            }
        }

        if(employeeIds.size() > 0){     
            String errorMessage = '';
            for(Contact contact : [ SELECT Name, (SELECT Name, ID FROM Devices__r WHERE Type__c = 'Laptop') FROM Contact WHERE ID IN: employeeIds ]){
                if(contact.Devices__r.size() == 1 ){
                    errorMessage = 'Cannot reassign or delete an employee’s only Laptop. Please assign ' + contact.Name +' another Laptop first.';          
                    newDevices.get(contact.Devices__r[0].Id).addError(errorMessage);  
                }
            }
        }
      
    }

    public static void handleDeviceDeletion(List<Device__c> devices){

        Set<Id> employeeIds = new Set<Id>();

        for(Device__c device : devices){
            if(device.Type__c == 'Laptop'){
                employeeIds.add(device.AssignedTo__c);
            }
        }
     
        String errorMessage = '';
            for(Contact contact : [ SELECT Name, (SELECT Name, ID FROM Devices__r WHERE Type__c = 'Laptop') FROM Contact WHERE ID IN: employeeIds]){
                if(contact.Devices__r.size() == 1 ){
                    errorMessage = 'Cannot reassign or delete an employee’s only Laptop. Please assign ' + contact.Name +' another Laptop first.';
                    Trigger.oldMap.get(contact.Devices__r[0].Id).addError(errorMessage);               
                }
            }
    }
}

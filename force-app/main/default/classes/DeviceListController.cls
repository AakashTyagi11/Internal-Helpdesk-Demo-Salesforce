public with sharing class DeviceListController {
    /** 
     * Controller Class.
     * @fetchDesktopsAndLaptops fetch all desktops and laptops associated with an employee.
     * @deleteDevices deletes a requested employee.
    */

    @AuraEnabled
    public static list<Device__c> fetchDesktopsAndLaptops(Id recordId){      
        List<String> types = new List<String>();
        types.add('Laptop');
        types.add('Desktop');
        List<Device__c> laptopAndDesktop = [ SELECT Name, Device_ID__c, Type__c FROM Device__c WHERE AssignedTo__r.Id =: recordId AND Type__c IN: types LIMIT 50 ];
        return laptopAndDesktop;
    }

    @AuraEnabled
    public static void deleteDevices(Id recordId){        
        Device__c device = [ SELECT ID, Name FROM Device__c WHERE ID =: recordId ];
        try {
            delete Device;  
        } catch (DmlException dmlException) {
            throw new AuraHandledException(dmlException.getDmlMessage(0));
        }       
    }
}

# Date Time Picker #

### Table Content ###
1. [Date Time JS](#date-time-js)

    1.1 [All SM](#all-sm)

    1.2 [Data Picker](#data-picker)
    
2. [Controllers](#controllers)

Date Time Picker is a custom functionality where we can define when can deliver the
customer order, we need different configurations to work with this customization.
### Date Time JS ###
we have a customized js file where we get the date selected by the user and show the times when the order can be delivered or picked up.
The file is located on _`app_custom_lety > cartridge > static > default > js`_

The `datetime.js` contains the main function with name `handleStoreHours()` and show the time that is available
in the shipping method using the `allSM`.

```javascript
  const handleStoreHours = (shippingMethodId = undefined) => {
    let timeForm = QS("#custom-store-hours");
    let allSM = JSON.parse(timeForm.getAttribute("data-store-hours"));
    let activeSM;
    if (shippingMethodId) {
      activeSM = { value: shippingMethodId };
    } else {
      activeSM = QS(".shipping-item-container input[type='radio'][checked]");
    }
    return allSM[activeSM.value] || allSM.default;
  };
```

<a name="all-sm"></a>
This **allSM** call the attribute `data-store-hours` it contains a _JSON_ with the delivery hours and
pick up hours, each delivery method can have a different store hours, even if Pasteleria Lety wants another delivery method we can add it in the _JSON_ with different hours.
How we can define the store hours in the proyect?, we need to go into the business manager to define it
_`Merchant Tools > Site Preferences > Custom Preferences > deliveryStoreConfigs > Delivery Methods Schedule`_.

Here you can see a _JSON_ object with `delviery method`, `weekdays`, `open hours` and `close hours`, you can modify these values if you need to see more or less delivery hours.

```json
{
    "pickup": {
        "days": {
            "mon": {
                "openHours": 8,
                "closeHours": 21
            },
            "tue": {
                "openHours": 8,
                "closeHours": 21
            }
        },
        "daysToOrderAfterCurrentDay": 1
    },
    "standart": {
        "days": {
            "mon": {
                "openHours": 8,
                "closeHours": 22,
                "after": true
            },
            "tue": {
                "openHours": 8,
                "closeHours": 22,
                "after": true
            }
        },
        "daysToOrderAfterCurrentDay": 0
    }
}
```

<a name="data-picker"></a>
Also we have another function that complement the main function for example `updateButtonsDate()`,
`updateStoreDay()` these two functions help us to update the HTML elements in the store. We have an other function specialy to
[special orders]() with name `handleForm()`, this function makes a calendar using a datepicker with jQuery (if you want to see more about datapicker you can go to 
[jQueryUI Datapicker](https://jqueryui.com/datepicker/)).

```javascript
var jq = jQuery.noConflict();
    jq("#calendar").datepicker({
      minDate: 5,
      dayNamesMin:['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat','Sun'],
      showOtherMonths: true,
      beforeShowDay: function (date) {
        var currentDate = new Date();
        var futureDate = new Date();
        futureDate.setMonth(currentDate.getMonth() + 5);
    
        // Disable dates beyond 5 months from today
        if (date > futureDate) {
          return [false, "ui-state-disabled", "Unavailable"];
        } else {
          return [true, "", "Available"];
        }
      },
      onSelect: function (dateText) {
        let selectedDate = new Date(dateText);
        selectedDate.setDate(selectedDate.getDate());
        let formattedDate = formatDate(selectedDate);
        let dateFormFW = QS(".form-control.shippingDate");
        dateFormFW.value = formattedDate;
      },
    });
```
### Controllers ###
We manage the information through controllers to use in the isml files, in this case
we use the file `Checkout.js` in the controller `Begin` here, we use `Site` class to get the
**custom preference value** with name **Delivery Methods Schedule** (you can see more information about 
[Site Class](https://salesforcecommercecloud.github.io/b2c-dev-doc/docs/current/scriptapi/html/index.html?target=class_dw_system_Site.html)). 
Once that we get the custom preference we use the `viewData` in the controller to set a new value into this.

#### Example ####
```javascript
//we get the view data in the controller Begin
const viewData = res.getViewData();

//Calling the custom preference using the class Site
let deliveryMethodsSchedule = Site.getCurrent().getCustomPreferenceValue("deliveryMethodsSchedule");

//Setting the new section in the view data 
viewData.deliveryMethodsSchedule = deliveryMethodsSchedule;

//creating new viewData with the last information and the new information 
res.setViewData(viewData);
```

With this new `viewData` we can call in the `isml` template the new values (`deliveryMethodsSchedule`).

#### Example ####

```html
<div 
class="d-flex flex-column" 
id="custom-store-hours" 
error-no-hours='${Resource.msg("address.date.no.available.hours", "forms", null)}' 
data-store-hours='${pdict.deliveryMethodsSchedule}'></div>
```
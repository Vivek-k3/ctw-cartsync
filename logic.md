There should be 3 carts:

Server Cart
Local Cart
Guest Cart.


When a user adds some things in to cart when he is not logged in 
User is not logged in
customer-condition = not-logged-in

Add all his cart activity to Guest Cart stored locally in Local Storage.


Whenever a user is logged in first check if there is a server cart, check if there is a guest cart and merge them and push it into local cart which is also stored in local storage.

imediately after merge Guest cart need to be cleared
Server cart need to be made equal to loca cart


customer-condition = not-logged-in
Whenever a user logs out but you still have a localcart remove local cart

customer id should always be fetched from smoothify, you dont need to save customer id.






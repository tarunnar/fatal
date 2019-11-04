var zomato_endpoint = "https://developers.zomato.com/api/v2.1/"
var categoryMap = new Map();
var cuisineMap = new Map();
var restaurantTypeMap = new Map();
var total_pages = null;
function populate_criteria(value){
    var collection=null;
    switch(value){
        case "cuisine":
            $.ajax({
                method: "GET",
                crossDomain: true,
                url: zomato_endpoint+"cuisines?city_id=6",  // hardcoded as for banglore city id is 4
                dataType: "json",
                async: true,
                headers: {
                  "user-key": "2ddaa2d4d751aa03dd3493372fbac29e",
                  'Accept': "appication/json"
                },
                success: function(data) {
                    var cuisine_data = data["cuisines"];
                    let inner = ""
                    for(let idx=0; idx< cuisine_data.length; idx+=1){
                     cuisineMap.set(cuisine_data[idx]["cuisine"]["cuisine_name"], cuisine_data[idx]["cuisine"]["cuisine_id"]);
                     inner +="<option>"+ cuisine_data[idx]["cuisine"]["cuisine_name"] + "</option>";
                    }
                    document.getElementById("to_be_populated").innerHTML = inner;
                },
                complete: function(data){
                },
                error: function() {
                  infoContent = "<div>Sorry, data is not coming through. Refresh and try again.</div>";
                    }
            });
            //collection=["cuisine1", "cuisine2", "cuisine3"];
            break;
        case "category":
            $.ajax({
                method: "GET",
                crossDomain: true,
                url: zomato_endpoint+"categories",
                dataType: "json",
                async: true,
                headers: {
                  "user-key": "2ddaa2d4d751aa03dd3493372fbac29e",
                  'Accept': "appication/json"
                },
                success: function(data) {
                    var category_data = data["categories"];
                    let inner = ""
                    for(let idx=0; idx< category_data.length; idx+=1){
                     categoryMap.set(category_data[idx]["categories"]["name"], category_data[idx]["categories"]["id"]);
                     inner +="<option>"+ category_data[idx]["categories"]["name"] + "</option>";
                    }
                    document.getElementById("to_be_populated").innerHTML = inner;

                },
                complete: function(data){
                },
                error: function() {
                  infoContent = "<div>Sorry, data is not coming through. Refresh and try again.</div>";
                    }
            });
            break;
        case "rest_type":
            $.ajax({
                method: "GET",
                crossDomain: true,
                url: zomato_endpoint+"establishments?city_id=4",
                dataType: "json",
                async: true,
                headers: {
                  "user-key": "2ddaa2d4d751aa03dd3493372fbac29e",
                  'Accept': "appication/json"
                },
                success: function(data) {
                    var restaurant_type_data = data["establishments"];
                    let inner = ""
                    for(let idx=0; idx< restaurant_type_data.length; idx+=1){
                     restaurantTypeMap.set(restaurant_type_data[idx]["establishment"]["name"], restaurant_type_data[idx]["establishment"]["id"]);
                     inner +="<option>"+ restaurant_type_data[idx]["establishment"]["name"] + "</option>";
                    }
                    document.getElementById("to_be_populated").innerHTML = inner;
                },
                complete: function(data){
                },
                error: function() {
                  infoContent = "<div>Sorry, data is not coming through. Refresh and try again.</div>";
                    }
            });
            break;
        default:
            alert("in default");
    }

    return false;
}
function city_autocomplete(){
    var data=['Bengaluru', 'Delhi NCR', 'Hyderabad'];
    $("#city").autocomplete({
        source: data
    });
}
function search_restaurant(){
    let search_criteria = document.forms["search_form"]["search_criteria"].value;
    let to_be_populated = document.forms["search_form"]["to_be_populated"].value;
    switch(search_criteria){
        case "cuisine":
            $.ajax({
                method: "GET",
                crossDomain: true,
                url: zomato_endpoint+"search?lat=12.9716&lon=77.5946&cuisines="+ cuisineMap.get(to_be_populated),
                dataType: "json",
                async: true,
                headers: {
                  "user-key": "2ddaa2d4d751aa03dd3493372fbac29e",
                  'Accept': "appication/json"
                },
                success: function(data) {
                    showrestaurants(data);
                },
                complete: function(data){
                },
                error: function() {
                  infoContent = "<div>Sorry, data is not coming through. Refresh and try again.</div>";
                    }
            });
        break;
        case "category":
            $.ajax({
                method: "GET",
                crossDomain: true,
                url: zomato_endpoint+"search?lat=12.9716&lon=77.5946&category="+ categoryMap.get(to_be_populated),
                dataType: "json",
                async: true,
                headers: {
                  "user-key": "2ddaa2d4d751aa03dd3493372fbac29e",
                  'Accept': "appication/json"
                },
                success: function(data) {

                    showrestaurants(data);
                },
                complete: function(data){
                },
                error: function() {
                  infoContent = "<div>Sorry, data is not coming through. Refresh and try again.</div>";
                }
            });
        break;
        case "rest_type":
            $.ajax({
                method: "GET",
                crossDomain: true,
                url: zomato_endpoint+"search?lat=12.9716&lon=77.5946&establishment_type="+ restaurantTypeMap.get(to_be_populated),
                dataType: "json",
                async: true,
                headers: {
                  "user-key": "2ddaa2d4d751aa03dd3493372fbac29e",
                  'Accept': "appication/json"
                },
                success: function(data) {
                    showrestaurants(data);
                },
                complete: function(data){
                },
                error: function() {
                  infoContent = "<div>Sorry, data is not coming through. Refresh and try again.</div>";
                }
            });
        break;
    }
    return false;
}
function showrestaurants(data){
    let restaurant_data = data["restaurants"];
    let current_location=window.location.href;
    let inner_data = "<div class='table-responsive'><table class='table' id='rest_results'><tr><th>Thumbnail</th> <th>Rest Name</th><th>Address</th><th> Zomato_URL </th><th>Cuisine</th><th>Rating</th></tr>";
    for(let idx=0; idx < restaurant_data.length; idx+=1){
        inner_data+="<tr>";
        inner_data+="<td>"+ "<img style='width:70px;height:70px;' src=" + restaurant_data[idx]["restaurant"]["thumb"]+">"+"</img>"+"</td>";
        inner_data+="<td>"+ "<a class='zomato_rest_id' target='_blank'  href="+ current_location+ "restaurants/"+ restaurant_data[idx]["restaurant"]["id"] +"/>"+restaurant_data[idx]["restaurant"]["name"]+"</a>" +"</td>";
        inner_data+="<td>"+ restaurant_data[idx]["restaurant"]["location"]["address"]+"</td>";
        inner_data+="<td>"+ "<a target='_blank' href="+restaurant_data[idx]["restaurant"]["url"]+">URL</a>"+"</td>";
        inner_data+="<td>"+ restaurant_data[idx]["restaurant"]["cuisines"]+"</td>";
        inner_data+="<td>"+ restaurant_data[idx]["restaurant"]["user_rating"]["aggregate_rating"]+"</td>";
        inner_data+="</tr>";
    }
    inner_data += "</table></div>";
    document.getElementById("table_for_data").innerHTML = inner_data;
    let nav_inner_substring="<nav aria-label=Page navigation example style=margin-left:500px;><ul class=pagination justify-content-center>";
    let results_found=data["results_found"];
    let results_shown = data["results_shown"];
    let results_start = data["results_start"];
    console.log(results_found);
    console.log(results_shown);
    console.log(results_start);
    if(results_start==0){
        nav_inner_substring+="<li class='page-item disabled'><a class=page-link href='#' >Previous</a></li>";
    }
    else{
    nav_inner_substring+="<li class='page-item'><a class=page-link href='#'>Previous</a></li>";
    }
    nav_inner_substring+="<li class=page-item><a class=page-link href=# id=current_page>"+(results_start/20)+1+"</a></li>";
    if(results_start+results_shown>=results_found){
        nav_inner_substring+="<li class='page-item disabled'><a class=page-link href='#' >Next</a></li>";
    }
    else{
        nav_inner_substring+="<li class='page-item'><a class=page-link href='#'>Next</a></li>";
    }
    nav_inner_substring+="</nav>";
    var iDiv = document.createElement('div');
    iDiv.id="pagination_div";
    let already=document.getElementById("pagination_div");
    if (already!=null){
        already.remove();
    }
    document.getElementById("complete_container").appendChild(iDiv);
    iDiv.innerHTML=nav_inner_substring;
}

$(document).on('click','.page-link',function(e) {
  let current_event=e.target.innerText;
  let ajax_url=zomato_endpoint+"search?lat=12.9716&lon=77.5946&";


});
var count;
function starmark(item)
{
    count=item.id[0];
    var subid= item.id.substring(1);
    for(var i=0;i<5;i++)
    {
        if(i<count)
        {
            document.getElementById((i+1)+subid).style.color="orange";
        }
        else
        {
            document.getElementById((i+1)+subid).style.color="black";
        }
    }
}
function result()
{
    if(count==null||count==""){
        alert("Please give star Rating");
        return false;
    }
    else{
        let rating_text = document.getElementById("comment").value
        var csrftoken = getCookie('csrftoken');
        $.ajax({
            method: "POST",
            crossDomain: true,
            url: "",
            dataType: "json",
            async: true,
            data: {
                'rating_value': count,
                'rating_text': rating_text,
                "user_id": 1,
                "csrfmiddlewaretoken" : csrftoken
            },
            headers: {
                "user-key": "2ddaa2d4d751aa03dd3493372fbac29e",
                'Accept': "appication/json"
            },
            success: function(data) {
                if(data["status"]=="Success"){
                    document.getElementById("review_status").innerHTML="Review Submitted Successfully";
                    document.getElementById("avg_rating").innerHTML="Average Rating:"+data["avg_rating"];
                    document.getElementById("review_status").style="color:green";
                    $('#reviews_table').append('<tr><td>'+ data["user_id"]+'</td><td>'+data["order_id"]+'</td><td>'+ data["rating_text"] +'</td><td>'+ data["rating_value"] +'</td></tr>');
                }
                else{
                    document.getElementById("review_status").innerHTML="Review not Submitted retry";
                    document.getElementById("review_status").style="color:red";
                }

            },
            complete: function(data){
            },
            error: function() {
                infoContent = "<div>Sorry, data is not coming through. Refresh and try again.</div>";
            }
            });
        return false;
    }
    return false;
}


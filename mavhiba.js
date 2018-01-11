var template = "Tisztelt Ügyfélszolgálat!%0D%0A%0D%0APanaszt szeretnék tenni az alábbi járattal történt utazásommal kapcsolatban,  [complaint]%0D%0A%0D%0AInduló állomás: [origin]%0D%0ACélállomás: [destination]%0D%0AUtazás ideje: [schedule]%0D%0A%0D%0AKérem panaszomat kivizsgálni szíveskedjenek!%0D%0A%0D%0AÜdvözlettel: %0D%0A[customer_name]";


var messages = {delay:"mivel a vonat [delay] perc késéssel közlekedett.", canceled: "mivel a vonat kimaradt, nem közlekedett.", crowded:"mivel a vonat rendkívül zsúfolt volt.", noheating:"mivel a vonaton a hűvös időjárás ellenére nem volt fűtés.", noac:"mivel a vonaton a rendkívül meleg időjárás ellenére nem üzemelt a klímaberendezés.", toohighac:"mivel a vonaton a klímaberendezés extrém alacsony hőmérsékleten működött.", kidnapped:"mivel a vonat ajtaja nem nyílt ki és a vonaton ragadtam.",cantgeton:"mivel nem tudtam felszállni a vonatra a rendkívüli zsúfoltság miatt.", other:"az alábbi problémák miatt:%0D%0A"};

var recepient = "eszrevetel@mav-start._hu_";
var request;

$(document).ready(function() {

  $('#schedule').bootstrapMaterialDatePicker({ switchOnClick: true, format : 'YYYY.MM.DD, dddd - HH:mm', lang : 'hu', weekStart : 1, maxDate : new Date()});

   $("#complaint").change(function(){
		if($( "#complaint" ).val() == "delay"){
			$("#delay").show();
		} else {
			$("#delaymin").val("");
			$("#delay").hide();
		}
	});

  $("#submitbtn").click(function(index){  

      $('#error-div').hide();
  
	  var complaint_orig = $( "#complaint" ).val();
	  var hasDelay = complaint_orig == "delay";
      var complaint = messages[complaint_orig];
      var schedule = $("#schedule").val();
      var origin = $("#origin").val();
      var destination = $("#destination").val();
      var customer_n = $("#customer_name").val();
      var comment = $("#comment").val();
      var delay = $("#delaymin").val();

	if(complaint_orig=="none"){
        $('#error-div').text("Válassza ki a panasz okát!");
        $('#error-div').show();
		return;
	}

	if(hasDelay && delay == ""){
        $('#error-div').text("Adja meg a késés idejét!");
        $('#error-div').show();
		return;
	}
	
    if(origin == destination){
        $('#error-div').text("Az induló- és célállomás ugyanaz!");
        $('#error-div').show();
        return;
      }

      if(schedule == "") {
        $('#error-div').text("Adja meg az utazás időpontját!");
        $('#error-div').show();
        return;
      }
    
      if(customer_n == ""){
        $('#error-div').text("Adja meg a nevét!");
        $('#error-div').show();
        return;
      }
	  
	  if((complaint_orig == "other") && (comment == "")){
        $('#error-div').text("A hiba részleteinek leírása kötelező!");
        $('#error-div').show();
        return;
	  }
    
     $('#error-div').hide();
	 if(hasDelay){
		complaint = complaint.replace("[delay]", delay);
	 }
	 
      var message = template.replace("[complaint]", complaint + "%0D%0A" + comment).replace("[origin]", origin).replace("[destination]", destination).replace("[schedule]", schedule).replace("[customer_name]", customer_n);
      //window.open("mailto:" + recepient + "?subject=Panasz&body=" + message, "_blank");

		request = $.ajax({
			url: "https://script.google.com/macros/s/AKfycbxFTCEc7kmocjjvTaHuXzfPxBaL0fZMXA8c1M72SYj0wyYgspA/exec",
			type: "GET",
			data: "customer_n=" + customer_n + "&complaint=" + complaint_orig + "&origin=" + origin + "&destination=" + destination + "&schedule=" + schedule + "&comment=" + comment + "&clientinfo=" + navigator.language + "\r\n" + navigator.userAgent + "&delay=" + delay
		});

		// Callback handler that will be called on failure
		request.fail(function (jqXHR, textStatus, errorThrown){
			console.log(
			"The following error occurred: "+
			textStatus, errorThrown
			);
		});
    
      });
});

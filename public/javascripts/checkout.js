Stripe.setPublishableKey('pk_test_Q4DsS2TZAniNuQpjw1YBKp3e');
var $form = $('#checkout-form');
$form.submit(function(event){
    //alert("ws");
    //alert($form.find('#card-number').val());
    
    $('#charge-error').addClass('hidden');
    $form.find('button').prop('disbaled', true);
    Stripe.card.createToken({
        number: $form.find('#card-number').val(),
        cvc : $form.find('#card-cvc').val(),
        exp_month : $form.find('#card-expiry-month').val(),
        exp_year : $form.find('#card-expiry-year').val(),
        name : $form.find('#card-name').val()
    }, stripeResponseHandler);
    
    return false;
});

function stripeResponseHandler(status, response){
    if(response.error){ //problem
        alert(response.error.message);
        $('#charge-error').text(response.error.message);
        $('#charge-error').removeClass('hidden');
        $form.find('button').prop('disbaled', false); //Reenable submission
    } else { //token was created
        var token = response.id;
        //insert the token to form
        $form.append($('<input type="hidden" name="stripeToken"/>').val(token));
        $form.get(0).submit();
    }
}

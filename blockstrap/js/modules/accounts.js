/*
 * 
 *  Blockstrap v0.5
 *  http://blockstrap.com
 *
 *  Designed, Developed and Maintained by Neuroware.io Inc
 *  All Work Released Under MIT License
 *  
 */

(function($) 
{
    // EMPTY OBJECT
    var accounts = {};
    
    // FUNCTIONS FOR OBJECT
    accounts.new = function(currency, name, password, keys, callback)
    {
        if(currency && name && password && keys && callback && $.isPlainObject($.fn.blockstrap.settings.currencies[currency]))
        {
            var key = '';
            var slug = blockstrap_functions.slug(name);
            $.fn.blockstrap.data.find('blockstrap', 'salt', function(salt)
            {
                if(!salt)
                {
                    $.fn.blockstrap.core.loader('close');
                    $.fn.blockstrap.core.modal('Error', 'No salt set for this device');
                }
                else
                {
                    $.fn.blockstrap.data.find('accounts', slug, function(account)
                    {
                        if(account)
                        {
                            $.fn.blockstrap.core.loader('close');
                            $.fn.blockstrap.core.modal('Warning', 'This account already exists');
                        }
                        else
                        {
                            if($.isPlainObject(keys))
                            {
                                var values = keys;
                                keys = [];
                                $.each(values, function(k, v)
                                {
                                    keys.push(k);
                                    key_obj = CryptoJS.SHA3(salt+key+k+v, { outputLength: 512 });
                                    key = key_obj.toString();
                                });
                            };
                            var address_key = new Bitcoin.ECKey(key);
                            var address = address_key.getBitcoinAddress().toString();
                            var pw_obj = CryptoJS.SHA3(salt+password, { outputLength: 512 });
                            var pw = pw_obj.toString();
                            var currency_name =  $.fn.blockstrap.settings.currencies[currency].currency;
                            var account = {
                                id: slug,
                                currency: {
                                    type: currency_name,
                                    code: currency
                                },
                                name: name,
                                password: pw,
                                keys: keys,
                                address: address,
                                incoming: 0,
                                outgoing: 0,
                                balance: 0
                            };
                            $.fn.blockstrap.data.save('accounts', slug, account, function()
                            {
                                callback(account);
                            });
                        }
                    });
                }
            });
        }
        else
        {
            $.fn.blockstrap.core.loader('close');
            if($.isPlainObject($.fn.blockstrap.settings.currencies[currency]))
            {
                $.fn.blockstrap.core.modal('Warning', 'Missing device requirements');
            }
            else
            {
                $.fn.blockstrap.core.modal('Warning', 'Currency not supported');
            }
        }
    }
    
    // MERGE THE NEW FUNCTIONS WITH CORE
    $.extend(true, $.fn.blockstrap, {accounts:accounts});
})
(jQuery);

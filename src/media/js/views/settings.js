define('views/settings',
    ['linefit', 'jquery', 'l10n', 'notification', 'requests', 'urls', 'user', 'utils', 'z'],
    function(linefit, $, l10n, notification, requests, urls, user, utils, z) {

    var _pd = utils._pd;
    var gettext = l10n.gettext;
    var notify = notification.notification;

    function update_settings() {
        var acc_sett = $('.account-settings');
        if (!acc_sett.length) {
            return;
        }
        acc_sett.find('[name=display_name]').val(user.get_setting('display_name'));
        acc_sett.find('[name=email]').val(user.get_setting('email'));
        acc_sett.find('input#enable_recommendations').prop(
            'checked', user.get_setting('enable_recommendations', true));
        z.page.trigger('reload_chrome');
    }

    z.page.on('submit', 'form.account-settings', _pd(function(e) {
        e.stopPropagation();
        if (!user.logged_in()) {
            return;
        }

        var $this = $(this);
        var data = {
            display_name: $this.find('#display_name').val(),
            enable_recommendations: $this.find('#enable_recommendations').prop('checked')
        };

        user.update_settings(data);
        requests.patch(
            urls.api.url('settings'),
            data
        ).done(function() {
            update_settings();
            notify({message: gettext('Settings saved')});
        }).fail(function() {
            notify({message: gettext('Settings could not be saved')});
        });

    })).on('logged_in', update_settings);

    return function(builder) {
        builder.start('settings/main.html');

        $('.linefit').linefit(2);

        builder.z('type', 'root settings');
        builder.z('title', gettext('Account Settings'));
        builder.z('parent', urls.reverse('homepage'));
    };
});

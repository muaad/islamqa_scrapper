# Crisps: A cool plugin for [crisp.im](https://crisp.im)
[Crisp](https://crisp.im) is a great minimalist live chat platform. This Chrome Plugin allows you to quickly show if a contact you are chatting to has already signed up for your service by doing a look up of the email address.

## Building your API

The service works by passing in an email address via a GET parameter named email. Your API should respond by returning a JSON response with the field `exists` set to either true or false depending on whether the email has signed up.

# Contributing

1. Fork it ( https://github.com/[my-github-username]/wechat/fork )
2. Create your feature branch (`git checkout -b my-new-feature`)
3. Commit your changes (`git commit -am 'Add some feature'`)
4. Push to the branch (`git push origin my-new-feature`)
5. Create a new Pull Request
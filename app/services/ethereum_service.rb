require 'net/http'
require 'json'

class EthereumService
  API_KEY = 'R9D635X3ZRAJHHWH7E4TVJ4IE8N7GBE8QF'.freeze

  def self.balance(address)
    eth_uri = "https://api.etherscan.io/api\
               ?module=account&action=balance&\
               address=#{address.token}&tag=latest&apikey=".freeze
    uri = URI.parse eth_uri
    balance = Net::HTTP.get uri
    JSON.parse(balance)['result']
  end
end

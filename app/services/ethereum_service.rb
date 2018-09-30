# frozen_string_literal: true

require 'net/http'
require 'json'

class EthereumService
  def self.balance(address)
    eth_uri = 'https://api.etherscan.io/api?module=account&action=balance&address='\
              "#{address.token}&tag=latest&apikey=#{ENV['ETH_SERVICE_KEY']}"
    uri = URI.parse eth_uri
    balance = Net::HTTP.get uri
    JSON.parse(balance)['result']
  end
end

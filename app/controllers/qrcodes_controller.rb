require 'net/http'
require 'json'

class QrcodesController < ApplicationController
  def new
    @crypto_names = %w[ETH BTC].sort
  end

  def create
    new_wallet = Wallet.new
    wallets_params[:wallets].map do |wallet|
      new_wallet.addresses << Address.new(wallet)
    end

    new_wallet.save! || render(status: 422)
    render json: { 'token': new_wallet.token }, status: 200
  end

  def show
    addresses = Wallet.find_by(token: params[:id]).addresses.map(&:as_json)
    render json: { 'wallets': addresses }, status: 200
  end

  private

  def wallets_params
    params.require(:qrcode).permit(wallets: %i[crypto_name token])
  end
end

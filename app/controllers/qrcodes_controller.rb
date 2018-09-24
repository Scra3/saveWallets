class QrcodesController < ApplicationController
  def index
  end

  def new
    @crypto_names = %w[EOS NEO BTC]
  end

  def create
    new_wallet = Wallet.new
    wallet_params[:wallets].map do |wallet|
      new_wallet.addresses << Address.new(wallet)
    end

    if new_wallet.save!
      render json: { 'token': new_wallet.token }, status: 200
    end
  end

  private

  def wallet_params
    params.require(:qrcode).permit(wallets: [:crypto_name, :token])
  end
end

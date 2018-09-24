class QrcodeController < ApplicationController
  def index
  end
  def new
    @crypto_names = %w[EOS NEO]
  end

end

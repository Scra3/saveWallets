Rails.application.routes.draw do
  get 'qrcode/new'
  get 'qrcode/index'
  root to: 'qrcode#index'
end

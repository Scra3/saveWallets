Rails.application.routes.draw do
  resources :qrcodes, only: [:index,:new, :create]
  root to: 'qrcodes#index'
end

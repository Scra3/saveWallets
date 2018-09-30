Rails.application.routes.draw do
  root to: 'qrcodes#new'

  resources :qrcodes, only: %i[new create show]
end

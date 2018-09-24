class Wallet < ApplicationRecord
  validates :token, presence: true

  before_validation :generate_token

  has_many :addresses

  protected

  def generate_token
    self.token = SecureRandom.urlsafe_base64
    generate_token if Wallet.exists?(token: self.token)
  end
end

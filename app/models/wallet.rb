class Wallet < ApplicationRecord
  before_validation :generate_token

  validates :token, presence: true

  has_many :addresses, dependent: :destroy

  protected

  def generate_token
    self.token = SecureRandom.urlsafe_base64
    generate_token if Wallet.exists?(token: token)
  end
end

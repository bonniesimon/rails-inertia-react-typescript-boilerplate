class ApplicationController < ActionController::Base
  allow_browser versions: :modern

  inertia_share do
    {
      flash: {
        notice: flash[:notice],
        alert:  flash[:alert]
      },
      env: -> { Rails.env.to_s }
    }
  end

  private

  def inertia_errors(model)
    { errors: model.errors.to_hash(true).transform_values(&:to_sentence) }
  end
end

if Rails.env.development?
  TypesFromSerializers.config do |config|
    # Keep snake_case keys to match Rails conventions
    config.transform_keys = ->(key) { key }
  end
end

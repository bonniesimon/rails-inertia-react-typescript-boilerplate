class BaseSerializer < Oj::Serializer
  include TypesFromSerializers::DSL

  def expand_raw
    options.dig(:expand) || []
  end
end

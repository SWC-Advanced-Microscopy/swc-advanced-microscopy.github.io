# Ruby 3.2+ removed String#tainted?/#untaint. Jekyll still depends on
# Liquid ~> 4.0, which calls them. This is a compatibility shim only —
# it has nothing to do with the site itself. Loaded by bin/preview.
class Object
  def tainted?
    false
  end unless method_defined?(:tainted?)

  def untaint
    self
  end unless method_defined?(:untaint)
end
